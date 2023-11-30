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
        let options = {};
        if (this.elm) {
            let mount = document.querySelector(this.elm);
            if (mount) {
                let optionsFromAttribute = mount.getAttribute('data-options');
                if (optionsFromAttribute) {
                    options = JSON.parse(optionsFromAttribute);
                }
                mount = null;
            }
        }
        this._options = {
            ...this._options,
            ...defaults,
            ...options,
        };
    }

    // Create an instance of the component and associate it with a DOM node
    mount() {}

    // Destroy the component instance and do any garbage collection to release memory
    unmount() {}

    // By default, we'll "refresh" the component by destroying and re-mounting it
    // Components can override this behaviour, if they are able to update themselves
    refresh() {
        this.unmount();
        this.restoreFromCache();
        this.mount();
    }

    // Components can optionally store the initial markup state of html they wrap,
    // and restore it to the original state before re-mounting
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