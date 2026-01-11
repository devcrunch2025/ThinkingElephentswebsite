
$(document).ready(function(){

$('.navbar-toggler .open').click( function() {
    $('.open').hide();
	 $('.close').show();
});



$('.navbar-toggler .close').click( function() {
    $('.open').show();
	 $('.close').hide();
});


});