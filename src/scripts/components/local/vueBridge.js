import BaseComponent from '../../framework/baseComponent';
import { loadStrategies } from '../../framework/loadStrategies';
import { createApp } from 'vue'

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

        // custom import strategies
        let strategy = el.dataset.load ?? null;
        let selector = el.getAttribute('id') ? '#' + el.getAttribute('id') : '[data-vue-component="'+el.dataset.vueComponent+'"]';
        let promises = loadStrategies(strategy, selector);

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
                    console.log('mounted ' + el.id);
                });
            });
    }
}