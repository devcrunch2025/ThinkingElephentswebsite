Place `navigation-video.mp4` in this folder to enable the navigation transition overlay.

- Expected path: `asset/video/navigation-video.mp4`
- If this file is not present, the site will fall back to `home.mp4` in the repo root.
- Choose a short muted clip (1–3s recommended) and make sure browser autoplay policies are satisfied (the video is muted by default).

To disable the overlay for a specific link, add `data-no-nav-video` to the `<a>` tag.

To change the timeout, edit `TIMEOUT` in `asset/js/nav-video-transition.js`.
