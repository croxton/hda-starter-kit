import BaseComponent from '../../framework/baseComponent';
import { loadStrategies } from '../../framework/loadStrategies';

export default class LocalBridge extends BaseComponent {

    instances = [];

    constructor(element) {
        super(element);
        this.mount();
    }

    mount() {

        // We'll create a new instance for each of the component placeholders in the page
        const components = document.querySelectorAll(this.elm);
        for(let el of components) {

            // load on demand
            this.lazyload(el);
        }
    }

    unmount() {
        if (this.mounted) {
            // remove instances to release memory
            this.instances.forEach( (instance) =>{
                instance.unmount();
            });

            // reset references to allow memory to be reclaimed
            this.instances.length = 0;
            this.instances = [];
        }
    }

    /**
     * Import a component on demand, optionally using a loading strategy
     *
     * @param el
     */
    lazyload(el) {

        // custom import strategies
        let strategy = el.dataset.load ?? null;
        let selector = el.getAttribute('id') ? '#' + el.getAttribute('id') : '[data-component="'+el.dataset.component+'"]';
        let promises = loadStrategies(strategy, selector);

        console.log('lazyload ' + selector);

        Promise.all(promises)
            .then(() => {
                // mount the component instance
                import(
                    /* webpackMode: "lazy" */
                    /* webpackChunkName: "components/local/[request]" */
                '../local/' + el.dataset.component
                    ).then((lazyComponent) => {
                        console.log('then ' + selector);
                        let app = new lazyComponent.default(selector);
                        app.mounted = true;
                        this.instances.push(app);
                });
            });
    }
}