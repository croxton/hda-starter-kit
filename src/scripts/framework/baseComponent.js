/**
 * Simple base component
 */

export default class BaseComponent {

    mounted = false;
    cache = [];
    restore = true;
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
    unmount() {
        this.elm = null;
    }

    // Triggered when the DOM mutates (e.g. new HTML injected)
    update() {}

    remount(element) {
        this.unmount();
        if (element) {
            this.elm = element;
        } else {
            this.elm = null;
        }
        //this.restore = true;
        this.restoreFromCache();
        this.mount();
    }

    restoreFromCache() {
        if (this.restore === true) {
            for (let key in this.cache) {
                if (this.cache.hasOwnProperty(key)) {
                    let el = document.querySelector(key);
                    if (el) {
                        el.innerHTML = this.cache[key];
                    }
                    el = null;
                }
            }
            // remove reference to allow gc to reclaim memory
            this.cache.length = 0;
            this.cache = [];
        }
    }
}