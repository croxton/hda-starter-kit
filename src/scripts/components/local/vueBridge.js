import BaseComponent from '../../framework/baseComponent';

import { createApp } from 'vue'
import * as strategies from '../../strategies/index.js';

// import our map component
//import App from '../vue/LocationMap.vue';

export default class VueBridge extends BaseComponent {

    vueInstances = [];

    constructor(element) {
        super(element);
        this.mount();
    }

    mount() {
        // attach to root element
        const vueComponents = document.querySelectorAll(this.elm);
        for(let el of vueComponents) {

            // make sure we have a clean slate (if DOM has been retrieved from history cache)
            el.innerHTML = '';

            // load on demand
            this.lazyload(el);
        }
    }

    unmount() {
        if (this.mounted) {
            // remove instances to release memory
            this.vueInstances.forEach( (instance) =>{
                instance.unmount();
            });

            // reset references to allow memory to be reclaimed
            this.vueInstances.length = 0;
            this.vueInstances = [];
        }
    }

    /**
     * Import a component on demand
     *
     * @param el
     */
    lazyload(el) {
        let promises = [];
        let strategy = el.dataset.load ?? null;

        // custom import strategies
        if (strategy) {

            // support multiple strategies separated by pipes
            // e.g. "idle | visible | media (min-width: 1024px)"
            let requirements = strategy
                .split('|')
                .map(requirement => requirement.trim())
                .filter(requirement => requirement !== 'immediate')
                .filter(requirement => requirement !== 'eager');

            for (let requirement of requirements) {
                // idle using requestIdleCallback
                if (requirement === 'idle') {
                    promises.push(
                        strategies.idle()
                    );
                    continue;
                }

                // media query, pass the rule inside parentheses
                // e.g."media (only screen and (min-width:768px))"
                if (requirement.startsWith('media')) {
                    promises.push(
                        strategies.media(requirement)
                    );
                    continue;
                }

                // visible using intersectionObserver, optionally pass the
                // root margins of the observed element inside parentheses
                // e.g."visible (0px 0px 0px 0px)"
                if (requirement.startsWith('visible')) {
                    console.log('visible');
                    // if element has a unique id, match that
                    let selector = el.getAttribute('id') ? '#' + el.getAttribute('id') : '[data-vue-component="'+el.dataset.vueComponent+'"]';
                    promises.push(
                        strategies.visible(selector, requirement)
                    );
                }
            }
        }

        Promise.all(promises)
            .then(() => {
                // mount a Vue instance, passing props from root element (via data attributes)
                import(
                    /* webpackMode: "lazy" */
                    /* webpackChunkName: "components/vue/[request]" */
                '../vue/' + el.dataset.vueComponent + '.vue'
                    ).then((vueComponent) => {
                    let app = createApp(vueComponent.default, { ...el.dataset });
                    console.log('mount vue component to ' + el.id);
                    app.mount(el);
                    this.vueInstances.push(app);
                });
            });
    }
}