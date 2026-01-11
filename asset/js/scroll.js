/*------------------------------
         SCROLL
  ------------------------------*/

$(window).scroll(function(){
  $('nav').toggleClass('scrolled', $(this).scrollTop() > 20);
  });