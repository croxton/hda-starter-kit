/**
 * Resize done event
 *
 * Publishes a 'resizeDone' event triggered when window resizing is complete.
 * Components can subscribe to it to update their state.
 * Also sets a --windowHeight css variable for use in CSS, instead of 100vh
 */

import PubSub from 'pubsub-js';

class ResizeDone {

    constructor() {

        // Store the window dimensions
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        // scrollbar width (will be 0 if system is using overlay scrollbars)
        let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        // set useful property for CSS
        document.documentElement.style.setProperty('--windowHeight', `${windowHeight}px`);
        document.documentElement.style.setProperty('--scrollbarWidth', `${scrollbarWidth}px`);

        window.addEventListener("resize", this.debounce(e => {

            // don't trigger a resize if the width hasn't changed
            if (window.innerWidth !== windowWidth) {

                // Update the window width for next time
                windowWidth = window.innerWidth;

                // Update the window height calculation
                windowHeight = window.innerHeight;

                document.documentElement.style.setProperty('--windowHeight', `${windowHeight}px`);

                // let other components subscribe to the event
                PubSub.publish('resizeDone', e);
            }
        }));
    }

    debounce = (fn, time) => {
        time = time || 100; // 100 by default if no param
        let timer;
        return function(event){
            if (timer) clearTimeout(timer);
            timer = setTimeout(fn, time, event);
        };
    }
}

export default ResizeDone;