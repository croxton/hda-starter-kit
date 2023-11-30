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

        // We'll create a new Vue application instance for each of the vue component placeholders
        // found in the swap target only, allowing components in parts of the
        // page *outside* the swap target to remain unchanged.
        let targetId = htmx.config.currentTargetId ?? 'main'; // default
        let target = document.getElementById(targetId);
        let vueComponents = target.querySelectorAll(this.elm);

        for(let el of vueComponents) {
            // make sure we have a clean slate (if DOM has been retrieved from history cache)
            el.innerHTML = '';
            // load on demand
            this.lazyload(el);
        }

        target = null;
        vueComponents = null;
    }

    unmount() {
        if (this.mounted) {
            let targetId = htmx.config.currentTargetId ?? 'main'; // default
            let target = document.getElementById(targetId);
            for (let i = this.vueInstances.length - 1; i >= 0; i--) {
                // 1. unmount if it IS in the swap target (it will be re-mounted)
                // 2. unmount if it IS NOT in the document at all
                let inTarget = target.querySelector(this.vueInstances[i].selector);
                let inDocument = document.querySelector(this.vueInstances[i].selector);
                if (inTarget || !inDocument) {
                    this.vueInstances[i].instance.unmount();
                    this.vueInstances.splice(i, 1); // remove from array
                }
            }
            target = null;
        }
    }

    /**
     * Import a Vue component on demand, optionally using a loading strategy
     *
     * @param el
     */
    lazyload(el) {

        // props
        let options = {};
        let optionsFromAttribute = el.getAttribute('data-options');
        if (optionsFromAttribute) {
            options = JSON.parse(optionsFromAttribute);
        }

        // custom import strategies
        let strategy = el.dataset.load ?? null;
        let selector = el.getAttribute('id') ? '#' + el.getAttribute('id') : '[data-vue-component="'+el.dataset.vueComponent+'"]';
        let promises = loadStrategies(strategy, selector);

        Promise.all(promises)
            .then(() => {
                // mount a Vue instance, passing props from root element (via data attributes)
                import(
                    `../vue/${el.dataset.vueComponent}.vue`
                    ).then((vueComponent) => {
                    let app = createApp(vueComponent.default, { ...options });
                    app.config.warnHandler = () => null;
                    app.mount(el);
                    this.vueInstances.push({
                        name:el.dataset.vueComponent,
                        selector: selector,
                        instance: app
                    });
                });
            });
    }
}