// Disable scrolling until hero video finishes or is skipped
$(document).ready(function() {
    var $body = $('body');
    var $video = $('.hero-video-section video').first();
    var $skipBtn = $('#skipVideoBtn');
    var $playBtn = $('#playVideoBtn');
    var scrollDisabled = true;

    function disableScroll() {
        $body.css({
            'overflow': 'hidden',
            'height': '100vh'
        });
        scrollDisabled = true;
    }
    function enableScroll() {
        $body.css({
            'overflow': '',
            'height': ''
        });
        scrollDisabled = false;
    }

    disableScroll();

    // Enable scroll when video ends
    $video.on('ended', function() {
        enableScroll();
    });

    // Enable scroll if user skips video
    $skipBtn.on('click', function() {
        enableScroll();
    });

    // Enable scroll if user replays video (optional: only after replay ends)
    $playBtn.on('click', function() {
        // If you want to enable scroll immediately on replay, uncomment:
        // enableScroll();
    });

    // Fallback: enable scroll after 10 seconds if video is still playing
    setTimeout(function() {
        if (scrollDisabled) enableScroll();
    }, 10000);
});
