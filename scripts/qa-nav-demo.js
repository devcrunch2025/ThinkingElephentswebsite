const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

function startSimpleStaticServer(root, port){
  const mime = {
    '.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.gif':'image/gif', '.mp4':'video/mp4', '.svg':'image/svg+xml', '.json':'application/json', '.webp':'image/webp'
  };
  const server = http.createServer((req,res)=>{
    try{
      const parsed = url.parse(req.url);
      let pathname = decodeURIComponent(parsed.pathname);
      if (pathname === '/') pathname = '/index.html';
      const abs = path.normalize(path.join(root, pathname));
      // prevent path traversal
      if (!abs.startsWith(root)) { res.statusCode = 403; res.end('Forbidden'); return; }
      fs.stat(abs, (err, stat)=>{
        if (err || !stat.isFile()){ res.statusCode = 404; res.end('Not found'); return; }
        const ext = path.extname(abs).toLowerCase();
        res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
        const stream = fs.createReadStream(abs);
        stream.on('error', ()=>{ res.statusCode = 500; res.end('Server error'); });
        stream.pipe(res);
      });
    }catch(e){ res.statusCode = 500; res.end('Server error'); }
  });
  return new Promise((resolve, reject)=>{
    server.listen(port, '127.0.0.1', (err)=>{
      if (err) reject(err); else resolve(server);
    });
  });
}

(async ()=>{
  const port = process.env.TEST_PORT ? parseInt(process.env.TEST_PORT,10) : 8003;
  const base = `http://127.0.0.1:${port}`;
  const out = path.resolve(__dirname, '..', 'qa-output');
  fs.mkdirSync(out, { recursive: true });

  const server = await startSimpleStaticServer(path.resolve(__dirname, '..'), port);
  console.log('Test server started on', base);

  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  let logs = [];
  let page;
  try {
    page = await browser.newPage();
    logs = [];
    page.on('console', msg => logs.push('[console] ' + msg.text()));
    page.on('pageerror', err => logs.push('[pageerror] ' + err.message));

    // Helper to pick a site-local html link
    const pickLocalLink = async () => {
      return await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a[href]:not([target="_blank"]):not([data-no-nav-video])'));
        for (const a of anchors) {
          const href = a.getAttribute('href')||'';
          if (href.includes('.html') && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && href !== '#' && !href.startsWith('javascript:')) return href;
        }
        return null;
      });
    };

    // Desktop test
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(base + '/', { waitUntil: 'networkidle2' });
    logs.push('[info] Opened ' + base + '/');

    // capture page content for debugging
    const html = await page.content();
    fs.writeFileSync(path.join(out, 'index-debug.html'), html, 'utf8');

    // Debug: list first anchors
    const anchors = await page.evaluate(()=>Array.from(document.querySelectorAll('a[href]')).map(a=>a.getAttribute('href')));
    logs.push('[debug] anchors: ' + JSON.stringify(anchors.slice(0,80)));
    // also write anchors immediately for debug
    fs.writeFileSync(path.join(out, 'anchors.json'), JSON.stringify(anchors, null, 2), 'utf8');

    let link = await pickLocalLink();
    if (!link) {
      // Fallback to common pages if no .html anchors found
      const candidates = ['service.html','about.html','portfolio.html','about.html','contact.html','team.html','faq.html','blog.html','index_old.html'];
      for (const c of candidates){
        try {
          if (fs.existsSync(path.resolve(__dirname, '..', c))){ link = c; break; }
        } catch(e){}
      }
    }
    if (!link) {
      throw new Error('No suitable local .html link found on the homepage or fallback candidates.');
    }
    logs.push('[info] Selected link: ' + link);

    // Click the link and wait for overlay
    const linkHandle = await page.$(`a[href="${link}"]`);
    if (!linkHandle) {
      throw new Error('Could not find the link element for ' + link);
    }

    await linkHandle.click();

    try {
      await page.waitForSelector('.nav-video-overlay[aria-hidden="false"]', { timeout: 4000 });
      logs.push('[info] Overlay became visible (desktop).');
      await page.screenshot({ path: path.join(out, 'desktop-overlay.png'), fullPage: false });
      const videoSrc = await page.evaluate(()=>{
        const v = document.querySelector('.nav-video-overlay video');
        return v ? (v.currentSrc || v.src) : null;
      });
      logs.push('[info] Video src: ' + videoSrc);

      // Click skip to immediately navigate
      await page.click('.nav-video-skip');
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 });
      await page.screenshot({ path: path.join(out, 'desktop-after-skip.png'), fullPage: true });
      logs.push('[info] Navigation completed after skip (desktop).');
    } catch (e) {
      logs.push('[warn] Overlay did not appear on desktop (or timed out): ' + e.message);
      await new Promise(r=>setTimeout(r,1500));
      await page.screenshot({ path: path.join(out, 'desktop-no-overlay.png'), fullPage: true });
    }

    // Mobile test (should bypass the overlay)
    await page.goto(base + '/', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 375, height: 812 });
    link = await pickLocalLink();
    logs.push('[info] Mobile test selected link: ' + link);
    const mobileLinkHandle = await page.$(`a[href="${link}"]`);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }),
      mobileLinkHandle.click()
    ]).catch(err => {
      logs.push('[warn] Mobile navigation may have failed or timed out: ' + err.message);
    });
    await page.screenshot({ path: path.join(out, 'mobile-after-nav.png'), fullPage: true });
    logs.push('[info] Mobile navigation completed (overlay should be disabled).');

    // Save logs
    fs.writeFileSync(path.join(out, 'console.log'), logs.join('\n'), 'utf8');
    console.log('QA run complete. Artifacts saved to:', out);

  } catch (err) {
    logs.push('[error] ' + err.message);
    try { fs.writeFileSync(path.join(out, 'console.log'), logs.join('\n'), 'utf8'); } catch(e){}
    console.error('QA script error:', err);
  } finally {
    try { await browser.close(); } catch(e){}
    try { server.close(); } catch(e){}
    console.log('Test server stopped.');
  }
})();