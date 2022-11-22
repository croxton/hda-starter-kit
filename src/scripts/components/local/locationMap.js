import BaseComponent from '../../framework/baseComponent';

import { createApp } from 'vue'

// import our map component
import App from '../vue/LocationMap.vue';

export default class LocationMap extends BaseComponent {

    vueMaps = [];

    constructor(element) {
        super(element);
        this.mount();
    }

    mount() {
        // attach to root element
        const locationSelectors = document.querySelectorAll(this.elm);
        for(let el of locationSelectors) {

            // make sure we have a clean slate (if DOM has been retrieved from history cache)
            el.innerHTML = '';

            // mount a Vue instance, passing props from root element (via data attributes)
            let app = createApp(App, { ...el.dataset });
            app.mount(el);
            this.vueMaps.push(app);
        }
    }

    unmount() {
        if (this.mounted) {
            // remove instances to release memory
            this.vueMaps.forEach( (instance) =>{
                instance.unmount();
            });

            // reset references to allow memory to be reclaimed
            this.vueMaps.length = 0;
            this.vueMaps = [];
        }
    }
}