/**
 * Load dynamic components
 */

import { loadStrategies } from './loadStrategies';

export default class LoadComponents {

    registered = []; // ALL registered components
    loaded = []; // Only loaded component objects

    constructor() {
        htmx.on('htmx:afterSwap', (htmxEvent) => {
            htmx.config.currentTargetId = htmxEvent.target.id;
            for (const [key, entry] of Object.entries(this.registered)) {
                this.lifeCycle(entry);
            }
        });
        htmx.on('htmx:historyRestore', (htmxEvent) => {
            htmx.config.currentTargetId = null;
            for (const [key, entry] of Object.entries(this.registered)) {
                this.lifeCycle(entry);
            }
        });
    }

    /**
     * Manage the component lifecycle
     *
     * @param {object}  entry
     */
    lifeCycle(entry) {
        if (entry.component in this.loaded) {
            // Component has already been loaded
            if (entry.selector) {
                // If the component must match a selector,
                // mount/unmount as necessary if found in DOM
                if (document.querySelector(entry.selector)) {
                    if (this.loaded[entry.component].mounted) {
                        this.loaded[entry.component].refresh();
                    } else {
                        this.loaded[entry.component].restoreFromCache();
                        this.loaded[entry.component].mount();
                        this.loaded[entry.component].mounted = true;
                    }
                } else {
                    this.loaded[entry.component].unmount();
                    this.loaded[entry.component].mounted = false;
                }
            }
        } else {
            // Not loaded yet
            if (entry.selector) {
                if (document.querySelector(entry.selector)) {
                    // we matched selector in the DOM, so load the entry
                    this.lazyload(entry);
                }
            } else {
                // load immediately (only once)
                this.lazyload(entry);
            }
        }
    }

    /**
     * Register a component
     *
     * @param {string}  component
     * @param {string | null}  selector
     * @param {string | null}  strategy
     */
    load(component, selector = null, strategy = null) {

        // register component
        let entry = {
            component: component,
            selector: selector,
            strategy: strategy,
        }

        this.registered.push(entry);

        // lazyload
        this.lifeCycle(entry);
    }

    /**
     * Import a component and run its constructor
     * We'll use lazy loading for the chunk file
     *
     * @param {object}  entry
     */
    lazyload(entry) {

        let promises = loadStrategies(entry.strategy, entry.selector);

        Promise.all(promises)
            .then(() => {
                import(
                    /* webpackMode: "lazy" */
                    /* webpackChunkName: "components/[request]" */
                '../components/local/' + entry.component
                    ).then((lazyComponent) => {
                    this.loaded[entry.component] = new lazyComponent.default(entry.selector);
                    this.loaded[entry.component].mounted = true;
                });
            });

    }
}