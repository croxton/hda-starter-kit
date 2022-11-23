import BaseComponent from '../../framework/baseComponent';
import { createApp } from 'vue'
import * as strategies from '../../strategies/index.js';

export default class VueBridge extends BaseComponent {

    vueInstances = [];

    constructor(element) {
        super(element);
        this.mount();
    }

    mount() {

        // @see https://vuejs.org/guide/essentials/application.html#multiple-application-instances
        // "If you are using Vue to enhance server-rendered HTML and only need Vue to control
        // specific parts of a large page, avoid mounting a single Vue application instance
        // on the entire page. Instead, create multiple small application instances and
        // mount them on the elements they are responsible for."

        // We'll create a new Vue application instance for each of the vue component placeholders in the page
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
                // note: this will throw an error if you remove elements
                // *inside* the root element after Vue has mounted
                instance.unmount();
            });

            // reset references to allow memory to be reclaimed
            this.vueInstances.length = 0;
            this.vueInstances = [];
        }
    }

    /**
     * Import a Vue component on demand, optionally using a loading strategy
     * (These are the same strategies provided by Async Alpine)
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
                    app.mount(el);
                    this.vueInstances.push(app);
                });
            });
    }
}