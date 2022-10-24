/**
 * Load dynamic components
 */

import * as strategies from '../strategies/index.js';

export default class LoadComponents {

    registered = []; // ALL registered components
    loaded = []; // Only loaded component objects

    reset(component) {
        // Unmount and reset any previously loaded components when restoring from history
        if (this.loaded[component].mounted === true && this.loaded[component].target) {
            this.loaded[component].unmount();
            this.loaded[component].mounted = false;
            this.loaded[component].restore = true;
        }
    }

    /**
     * Import a component (lazily, creating a separate chunk) and run its constructor
     *
     * @param {string}  component
     * @param {string | null}  selector
     * @param {string | null}  target
     * @param {string | null}  strategy
     */
    load(component, selector= null, target = null, strategy = null) {

        // Lazy load a component
        if (selector && target) {

            // Only load the component if a specific selector exists in the DOM
            let elm = document.querySelector(selector);
            if (elm) {
                this.lazyLoad(component, selector, target, strategy);
            }
            elm = null;

            if (!(component in this.registered)) {

                // If we've been given a target, listen for when the component enters or exits the dom
                // Components can optionally save the innerHTML of one or more elements representing
                // the initial dom state of the component before it is changed by the component logic.
                // Here we restore the initial state *before* the dom is saved into history
                // so that on restoration from the page cache, we get back the original pristine dom state
                htmx.on('htmx:beforeHistorySave', (htmxEvent) => {
                    if (component in this.loaded) {
                        this.loaded[component].restoreFromCache();
                    }
                });

                // Allow component to do its own garbage collection when swapping to a new page,
                // such as removing event listeners and destroying objects created by the component.
                htmx.on('htmx:beforeSwap', (htmxEvent) => {
                    if (component in this.loaded && this.loaded[component].mounted) {
                        if (htmxEvent.target.id === target) {
                            this.loaded[component].unmount();
                            this.loaded[component].mounted = false;
                            this.loaded[component].restore = true;
                        } else {
                            // If we're swapping into an *element that is NOT the component target*,
                            // prevent the initial dom state of an already-mounted component
                            // being restored from cache in this swap
                            this.loaded[component].restore = false;
                        }
                    }
                });

                // New page swapped in, load and mount the component *if* the swapped element matches our component's target
                htmx.on('htmx:afterSwap', (htmxEvent) => {
                    if (htmxEvent.target.id === target) {
                        let elm = document.querySelector(selector);
                        if (elm) {
                            this.lazyLoad(component, selector, target, strategy, htmxEvent);
                        }
                        elm = null;
                    }
                });

                htmx.on('htmx:historyRestore', (htmxEvent) => {
                    if (component in this.loaded) {
                        this.reset(component);
                    }
                    let elm = document.querySelector(selector);
                    if (elm) {
                        this.lazyLoad(component, selector, target, strategy, htmxEvent);
                    }
                });
            }

        } else if (selector) {

            // Only load the component if a specific selector exists in the DOM
            let elm = document.querySelector(selector);
            if (elm) {
                this.lazyLoad(component, selector, target, strategy);
            }
            elm = null;

            // We'll call the component's update() method on *any* subsequent HTMX swap.
            // To do that, we subscribe it *the first time* the component is loaded
            if (!(component in this.registered)) {
                htmx.on('htmx:afterSwap', (htmxEvent) => {
                    if (component in this.loaded) {
                        if (htmxEvent.detail.elt.querySelector(selector)) {
                            this.loaded[component].update(htmxEvent);
                        }
                    } else {
                        if (document.querySelector(selector)) {
                            this.lazyLoad(component, selector, target, strategy, htmxEvent);
                        }
                    }
                });
                htmx.on('htmx:historyRestore', (htmxEvent) => {
                    let elm = document.querySelector(selector);
                    if (elm) {
                        this.lazyLoad(component, selector, target, strategy, htmxEvent);
                    }
                });
            }

        } else {
            // No selector, so this is a component that is initialised only once and persists through page swaps
            this.lazyLoad(component);

            // We'll call the component's update() method on *any* subsequent HTMX swap.
            // To do that, we subscribe it *the first time* the component is registered
            if (!(component in this.registered)) {
                htmx.on('htmx:afterSwap', (htmxEvent) => {
                    if (component in this.loaded) {
                        this.loaded[component].update(htmxEvent);
                    }
                });
            }
        }

        // keep a register of components we've added events to
        this.registered.push(component);
    }

    /**
     * Import a component and run its constructor
     * We'll use lazy loading for the chunk file
     *
     * @param {string}  component
     * @param {string | null}  selector
     * @param {string | null}  target
     * @param {string | null}  strategy
     * @param {string | null} htmxEvent
     */
    lazyLoad(component, selector = null, target = null, strategy = null, htmxEvent = null) {

        if (component in this.loaded) {

            if (this.loaded[component].target) {
                // remount components
                this.loaded[component].remount(selector);
                this.loaded[component].mounted = true;
            } else {
                // update persistent components
                this.loaded[component].update(htmxEvent);
            }
        } else {

            let promises = [];

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
                        promises.push(
                            strategies.visible(selector, requirement)
                        );
                    }
                }
            }

            Promise.all(promises)
                .then(() => {
                    import(
                        /* webpackMode: "lazy" */
                        /* webpackChunkName: "components/[request]" */
                    '../components/local/' + component
                        ).then((lazyComponent) => {
                        this.loaded[component] = new lazyComponent.default(selector);
                        this.loaded[component].mounted = true;
                        this.loaded[component].target = target;
                    });
                });

        }
    }
}