/**
 * Resize done event
 */

import PubSub from 'pubsub-js';

function debounce(func){
    let timer;
    return function(event){
        if(timer) clearTimeout(timer);
        timer = setTimeout(func,100,event);
    };
}

// Store the window dimensions
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

// set useful property for CSS
document.documentElement.style.setProperty('--windowHeight', `${windowHeight}px`);

window.addEventListener("resize", debounce(e => {

    if (window.innerWidth !== windowWidth) {
        PubSub.publish('resizeDone', e);

        // Update the window width for next time
        windowWidth = window.innerWidth;

        // Update the window height
        windowHeight = window.innerHeight;
        document.documentElement.style.setProperty('--windowHeight', `${windowHeight}px`);
    }
}));