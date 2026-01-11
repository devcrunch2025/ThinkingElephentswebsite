

$(document).ready(function () {
	$(".testimonial-section .indicators li").click(function () {
		var i = $(this).index();
		var targetElement = $(".testimonial-section .circle-container .img-block");
		targetElement.eq(i).addClass('active');
		targetElement.not(targetElement[i]).removeClass('active');
	});



	$(".testimonial-section  .img-block").click(function () {
		var targetElement = $(".testimonial-section  .img-block");
		targetElement.addClass('active');
		targetElement.not($(this)).removeClass('active');
	});



	$(function(){
		$(".feature-section .col-12 .card").click(function(){
		  $(".feature-section .col-12 .card").removeClass("active");
		  $(this).addClass("active");
		});
	  });

});



$(document).ready(function () {
	$(".slider .swiper-pagination span").each(function (i) {
		$(this).text(i + 1).prepend("0");
	});
});



