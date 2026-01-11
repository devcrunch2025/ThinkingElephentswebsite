(function($){
  $(function(){
    const VIDEO_SRC = 'asset/video/navigation-video.mp4';
    const FALLBACK = 'home.mp4';
    const TIMEOUT = 2500; // ms

    const $overlay = $('<div class="nav-video-overlay" style="display:none" aria-hidden="true" role="dialog" aria-modal="true" tabindex="-1"><video class="nav-video" muted playsinline></video><button class="nav-video-skip" aria-label="Skip transition">Skip</button></div>');
    $('body').append($overlay);
    const $video = $overlay.find('video');
    const $skip = $overlay.find('.nav-video-skip');

    let navHref = null;
    let fallbackTimer = null;

    function navigateTo(href){
      clearTimeout(fallbackTimer);
      $overlay.hide().attr('aria-hidden','true');
      try { $overlay.blur(); } catch(e) {}
      $('body').removeClass('nav-video-open'); // restore scrolling and page state
      window.location.href = href;
    }

    // If true, disable the transition on narrow screens (mobile)
    const DISABLE_ON_MOBILE = true;

    function showAndPlay(href){
      // Quick path: skip overlay on mobile to avoid autoplay/UX issues
      if (DISABLE_ON_MOBILE && window.matchMedia && window.matchMedia('(max-width: 767px)').matches) {
        navigateTo(href);
        return;
      }

      navHref = href;
      $overlay.show().attr('aria-hidden','false').focus();
      $('body').addClass('nav-video-open'); // prevent page scrolling / background interaction while overlay is shown
      $video.off('.nav');
      $video.attr('src', VIDEO_SRC);
      const v = $video.get(0);
      // reset
      try { v.currentTime = 0; } catch(e) {}
      // play and handle autoplay restrictions
      const p = v.play();
      if (p !== undefined) {
        p.catch(() => {
          // autoplay blocked; navigate after timeout instead
          fallbackTimer = setTimeout(()=>navigateTo(href), TIMEOUT);
        });
      }

      // If the video errors (file missing) switch to fallback
      $video.on('error.nav', function(){
        $video.off('error.nav');
        $video.attr('src', FALLBACK);
        v.play().catch(()=>{ fallbackTimer = setTimeout(()=>navigateTo(href), TIMEOUT); });
      });

      // Ended handler
      $video.on('ended.nav', function(){ navigateTo(href); });

      // Safety timeout in case neither ended nor error fired
      fallbackTimer = setTimeout(()=>navigateTo(href), TIMEOUT + 1000);

    }

    // Intercept internal links (opt-out with data-no-nav-video)
    $(document).on('click', 'a[href]:not([target="_blank"]):not([data-no-nav-video])', function(e){
      const href = $(this).attr('href');
      if (!href) return;
      // Ignore hash links, protocols, mailto, tel
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.match(/^[a-zA-Z]+:/)) return;
      const resolved = new URL(href, location.href);
      if (resolved.origin !== location.origin) return; // external
      const path = resolved.pathname;
      const ext = path.split('.').pop().toLowerCase();
      const skipExts = ['jpg','jpeg','png','gif','pdf','zip','svg','webp','mp4','webm'];
      if (skipExts.includes(ext) && !path.endsWith('.html')) return;

      e.preventDefault();
      showAndPlay(resolved.href);
    });

    // Click overlay or skip to immediately navigate
    $overlay.on('click', function(){ if (navHref) navigateTo(navHref); });
    $skip.on('click', function(e){ e.stopPropagation(); if (navHref) navigateTo(navHref); });

    // expose a global to toggle timeout if needed
    window.NAV_VIDEO_TIMEOUT = TIMEOUT;

  });
})(jQuery);