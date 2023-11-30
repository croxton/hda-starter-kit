/**
 * Viewport
 */

import PubSub from 'pubsub-js';

class Viewport {

    constructor() {

        // SSR support
        if (typeof window === 'undefined') {
            return;
        }

        // div to use for measurement
        this.measureVh = document.getElementById('measure-vh');

        this.measureViewport();

        let self = this;
        window.addEventListener("resize", this.debounce(e => {

            self.measureViewport();

            // let other components subscribe to the event
            PubSub.publish('resizeDone', e);

        }));
    }

    measureViewport() {

        if ('CSS' in window &&
            'supports' in window.CSS &&
            window.CSS.supports('height: 100svh') &&
            window.CSS.supports('height: 100dvh') &&
            window.CSS.supports('height: 100lvh')
        ) {
            // Native support for svh, dvh and lvh units
            document.documentElement.style.setProperty('--1svh', "1svh");
            document.documentElement.style.setProperty('--1dvh', "1dvh");
            document.documentElement.style.setProperty('--1lvh', "1lvh");
        } else {

            // Polyfill

            // smallest viewport height
            let svh = document.documentElement.clientHeight * 0.01;
            document.documentElement.style.setProperty('--1svh', (svh + "px"));

            // dynamic viewport height
            let dvh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--1dvh', (dvh + "px"));

            // largest possible viewport height (behaves the same as 1vh)
            let fixedHeight = this.measureVh.clientHeight;
            let lvh = fixedHeight * 0.01;
            document.documentElement.style.setProperty('--1lvh', (lvh + "px"));
        }

        // scrollbar width (will be 0 if system is using overlay scrollbars)
        let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.documentElement.style.setProperty('--scrollbarWidth', (scrollbarWidth + "px"));
    }

    debounce(fn, time) {
        time = time || 100; // 100 by default if no param
        let timer;
        return function(event) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(fn, time, event);
        };
    }
}

export default Viewport;