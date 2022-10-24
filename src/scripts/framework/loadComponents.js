/**
 * Load dynamic components
 */

import * as strategies from '../strategies/index.js';

export default class LoadComponents {

    registered = []; // ALL registered components
    loaded = []; // Only loaded component objects

    constructor() {
        htmx.on('htmx:afterSwap', (htmxEvent) => {
            for (const [key, entry] of Object.entries(this.registered)) {
                this.lifeCycle(entry);
            }
        });
        htmx.on('htmx:historyRestore', (htmxEvent) => {
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
                        this.loaded[entry.component].remount();
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

        let promises = [];

        // custom import strategies
        if (entry.strategy) {

            // support multiple strategies separated by pipes
            // e.g. "idle | visible | media (min-width: 1024px)"
            let requirements = entry.strategy
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
                if (requirement.startsWith('visible') && entry.selector) {
                    promises.push(
                        strategies.visible(entry.selector, requirement)
                    );
                }
            }
        }

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