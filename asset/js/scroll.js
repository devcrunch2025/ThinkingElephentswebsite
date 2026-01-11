/*------------------------------
         SCROLL
  ------------------------------*/

$(window).scroll(function(){
  $('nav').toggleClass('scrolled', $(this).scrollTop() > 20);
  });

// Floating WhatsApp button (fixed bottom-right)
$(function(){
  var $btn = $('<a>', {
    href: 'https://web.whatsapp.com/send?phone=9189898989898',
    target: '_blank',
    rel: 'noopener',
    'aria-label': 'WhatsApp',
    'data-no-nav-video': 'true',
    class: 'floating-whatsapp'
  });

  var $img = $('<img>', {
    src: 'asset/img/whatsapp.png',
    alt: 'WhatsApp',
    class: 'whatsapp-bounce'
  });

  $btn.css({
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    width: '56px',
    height: '56px',
    'border-radius': '50%',
    background: 'transparent',
    overflow: 'hidden',
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    'box-shadow': '0 8px 20px rgba(0,0,0,0.2)',
    'z-index': 9999,
    'transition': 'transform 0.2s ease, box-shadow 0.2s ease'
  });

  $img.css({
    width: '100%',
    height: '100%',
    'object-fit': 'cover'
  });

  $btn.on('mouseenter', function(){
    $(this).css({
      transform: 'translateY(-2px)',
      'box-shadow': '0 12px 28px rgba(0,0,0,0.25)'
    });
  }).on('mouseleave', function(){
    $(this).css({
      transform: 'none',
      'box-shadow': '0 8px 20px rgba(0,0,0,0.2)'
    });
  });

  $btn.append($img);
  $('body').append($btn);
});

// Favicon fly-by after page load and set favicon as cursor
$(window).on('load', function(){
  try {
    var src = 'asset/img/favicon.png';
    var $fly = $('<img>', {
      src: src,
      alt: 'favicon fly-by',
      class: 'favicon-fly'
    });
    $('body').append($fly);
    $fly.on('animationend', function(){ $(this).remove(); });

    // Set favicon as cursor (with hotspot at 16,16)
    $('body').css('cursor', 'url('+src+') 16 16, auto');
  } catch(e) {
    // silently ignore
  }
});