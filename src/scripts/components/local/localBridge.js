import BaseComponent from '../../framework/baseComponent';
import { loadStrategies } from '../../framework/loadStrategies';

export default class LocalBridge extends BaseComponent {

    loaded = [];

    constructor(element) {
        super(element);
        this.mount();
    }

    mount() {
        // Create a new instance for component placeholders
        // found in the swap target only, allowing components in parts of the
        // page *outside* the swap target to remain unchanged.
        let targetId = htmx.config.currentTargetId ?? 'main'; // default
        let target = document.getElementById(targetId);
        let components = target.querySelectorAll(this.elm);

        for(let el of components) {
            // load on demand
            this.lazyload(el);
        }
        target = null;
        components = null;
    }

    unmount() {
        if (this.mounted) {
            let targetId = htmx.config.currentTargetId ?? 'main'; // default
            let target = document.getElementById(targetId);
            for (let i = this.loaded.length - 1; i >= 0; i--) {
                // 1. unmount if it IS in the swap target (it will be re-mounted)
                // 2. unmount if it IS NOT in the document at all
                let inTarget = target.querySelector(this.loaded[i].selector);
                let inDocument = document.querySelector(this.loaded[i].selector);
                if (inTarget || !inDocument) {
                    this.loaded[i].instance.unmount();
                    this.loaded.splice(i, 1); // remove from array
                }
            }
            target = null;
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

        Promise.all(promises)
            .then(() => {
                // mount the component instance
                import(
                    `../local/${el.dataset.component}.js`
                    ).then((lazyComponent) => {
                    let instance = new lazyComponent.default(selector);
                    instance.mounted = true;
                    this.loaded.push({
                        name:el.dataset.component,
                        selector: selector,
                        instance: instance
                    });
                });
            });
    }
}