/**
 * Simple base component
 */

export default class BaseComponent {

    mounted = false;
    cache = [];
    elm = null;
    target = null;

    constructor(element="", options={}) {
        this._options = options || {};
        if (element) {
            this.elm = element;
        }
    }

    get options() {
        return this._options;
    }

    set options(defaults) {
        this._options = {
            ...this._options,
            ...defaults
        };
        return this._options;
    }

    // Create an instance of the component and associate it with a DOM node
    mount() {}

    // Destroy the component instance and do any garbage collection to release memory
    unmount() {}

    // Triggered when the DOM mutates (e.g. new HTML injected)
    update() {}

    remount() {
        this.unmount();
        this.restoreFromCache();
        this.mount();
    }

    restoreFromCache() {
        for (let key in this.cache) {
            if (this.cache.hasOwnProperty(key)) {
                let el = document.querySelector(key);
                if (el) {
                    el.innerHTML = this.cache[key];
                    htmx.process(el);
                }
                el = null;
            }
        }
        // remove reference to allow gc to reclaim memory
        this.cache.length = 0;
        this.cache = [];
    }
}