/**
 * Video player (with Plyr.io)
 *
 * Video player controls for native <video>
 * Also supports Vimeo and YouTube
 */

/**
 * Example markup
 *
 <div class="c-video" data-component="videoPlayer" id="video-2">

    <!-- Poster image -->
     <img
        class="c-video__poster"
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
        alt="">

    <!-- Play button -->
     <button class="c-video__btn">Play</button>

     <!-- Video player -->
     <div
        class="c-video__player w-1/2"
        data-class="w-full h-full"
        data-src-mp4="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4">
     </div>
 </div>
 */

import BaseComponent from '../../framework/baseComponent';
import Plyr from 'plyr';
import "plyr/dist/plyr.css";
import PubSub from 'pubsub-js';

export default class VideoPlayer extends BaseComponent {

    videoMount = null;
    videoPlayer = null;
    playerInstance = null;
    playerSubscriber = null;

    constructor(elm) {
        super(elm);
        this.videoMount = document.querySelector(elm);
        this.videoPlayer = this.videoMount.querySelector('.c-video__player');
        this.mount();
    }

    mount() {

        // lazy load videos entering the viewport
        let videoBtn = this.videoMount.querySelector('.c-video__btn');
        let video, track, srcWebm, srcMp4, srcVimeo, srcYoutube;

        // video sources
        srcWebm     = this.videoPlayer.dataset.srcWebm ?? null;
        srcMp4      = this.videoPlayer.dataset.srcMp4 ?? null;
        srcVimeo    = this.videoPlayer.dataset.srcVimeo ?? null;
        srcYoutube  = this.videoPlayer.dataset.srcYoutube ?? null;

        if (srcWebm || srcMp4) {

            // HTML5 native <video>
            /*
            <video id="player" playsInline controls
                   data-poster="/path/to/poster.jpg">
                <source src="/path/to/video.mp4"
                        type="video/mp4"/>
                <source src="/path/to/video.webm"
                        type="video/webm"/>
                <track kind="captions" label="English" srclang="en" src="" default />
            </video>
             */
            video = document.createElement("video");

            // setup track - we need this as a workaround for a bug
            // @see https://github.com/sampotts/plyr/issues/2034
            track = document.createElement("track");
            track.setAttribute("kind","captions");
            track.setAttribute("label","English");
            track.setAttribute("srclang","en");
            track.setAttribute("src","");
            track.setAttribute("default","");
            video.appendChild(track);

            if (srcWebm && video.canPlayType("video/webm")) {
                // Use webm, if supported
                video.setAttribute("type","video/webm");
                video.setAttribute("src", srcWebm);
            } else if (srcMp4) {
                // fallback to mp4
                video.setAttribute("type","video/mp4");
                video.setAttribute("src", srcMp4);
            }

            // default player config
            //video.playsinline = true;
            video.controls = true;

        } else {

            // Youtube or Vimeo embed
            video = document.createElement("div");

            if (srcVimeo) {
                video.setAttribute("data-plyr-provider","vimeo");
                video.setAttribute("data-plyr-embed-id", srcVimeo);
            } else if (srcYoutube) {
                video.setAttribute("data-plyr-provider","youtube");
                video.setAttribute("data-plyr-embed-id", srcYoutube);
            }
        }

        // add poster image
        let poster = this.videoPlayer.dataset.poster;
        if (poster) {
            video.setAttribute("data-poster", poster);
        }

        // add classes
        let cssClass = this.videoPlayer.dataset.class;
        if (cssClass) {
            video.setAttribute("class", cssClass);
        }

        // insert into dom
        this.videoPlayer.innerHTML = null; // make sure we only add one instance
        this.videoPlayer.appendChild(video);

        // initialise Plyr
        let player = new Plyr(video, {
            controls: ['play', 'progress', 'mute', 'volume', 'airplay', 'fullscreen'],
            youtube: {
                playsinline : false,
                rel : 0,
                autoplay:0,
                noCookie:true
            },
            fullscreen : {
                enabled: true,
            },
            hideControls: true,
            ratio: '16:9'
        });

        // save a unique ID
        player.plyId = 'plyr-' + this.videoMount.id;

        // Add a class to use for unveiling the player once loaded
        player.on('ready', (event) => {
            this.videoMount.classList.add('is-ready');
        });

        // subscribe to 'videoPlayer.play'
        let topic = 'video.play';
        this.playerSubscriber = PubSub.subscribe(topic, (msg, id) => {
            if (id !== player.plyId) {
                player.pause();
            }
        });

        player.on('play', event => {
            this.videoMount.classList.add('is-playing');
            // pause any other videos mounted on the page that are playing
            PubSub.publish(topic, player.plyId);
        });

        player.on('pause', event => {
            this.videoMount.classList.remove('is-playing');
        });

        // allow .c-video__btn to toggle playback
        videoBtn.addEventListener('click', (event) => {
            if (player.playing) {
                player.pause();
            } else {
                player.play();
            }

            // class indicates video has been play (hide poster image)
            this.videoMount.classList.add('is-active');
        });

        // save the instance ref
        this.playerInstance = player;

    }

    unmount() {
        if (this.mounted) {

            // reset classes on root element
            this.videoMount.classList.remove('is-ready');
            this.videoMount.classList.remove('is-active');
            this.videoMount.classList.remove('is-playing');

            // remove markup inside video player container
            this.videoPlayer.innerHTML = null;

            // remove listeners on play button
            let videoBtn = this.videoMount.querySelector('.c-video__btn');
            videoBtn.clearEventListeners();
            videoBtn = null;

            // remove instance
            this.playerInstance.destroy();

            // unsubscribe
            PubSub.unsubscribe(this.playerSubscriber);

            // reset properties
            this.videoMount = null;
            this.videoPlayer = null;
            this.playerInstance = null;
            this.playerSubscriber = null;
        }
    }
}