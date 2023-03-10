/*
 * Htmx init
 *
 * Initialise htmx
 */

export default class HtmxInit {

    constructor() {

        // log all events for debugging
        //htmx.logger = function(elt, event, data) {
        //    if(console) {
        //        console.log("INFO:", event, elt, data);
        //    }
        //}
        //htmx.logAll();

        (function () {

            let cache = {
                now : {},
                next : {}
            };

            function saveToCache(dom, store) {
                let markers = dom.querySelectorAll('[hx-history-preserve]');
                if (markers) {
                    for (let i=0; i<markers.length; ++i) {
                        if (typeof markers[i].id !== 'undefined') {
                            cache[store][markers[i].id] = markers[i].outerHTML;
                        }
                    }
                }
            }

            function restoreFromCache() {
                // Replace elements with their original markup
                for (let key in cache.now) {
                    let el = document.getElementById(key);
                    if (el) {
                        el.outerHTML = cache.now[key];
                    }
                    el = null;
                }
                // Rotate cache, ready for the next history save
                if (Object.keys(cache.next).length > 0) {
                    cache.now = cache.next;
                    cache.next = {};
                } else {
                    cache.now = {};
                }
            }

            htmx.defineExtension('history-preserve', {

                init : function() {
                    // On page load, cache the initial dom state of preserved
                    // elements before they are manipulated by JS
                    saveToCache(document, 'now');
                },

                onEvent : function(name, event) {

                    if (name === "htmx:beforeSwap") {
                        // On swap, save the initial dom state of any preserved
                        // elements in the incoming DOM.
                        // We won't need this until the *next* request that
                        // triggers a history save
                        let incomingDOM = new DOMParser().parseFromString(event.detail.xhr.response, "text/html");
                        if (incomingDOM) {
                            saveToCache(incomingDOM, 'next');
                        }
                        incomingDOM = null;
                    }

                    if (name === "htmx:beforeHistorySave") {
                        // Restore the pristine dom state of preserved elements
                        // before htmx saves the page to the history cache
                        restoreFromCache();
                    }

                    if (name === 'htmx:historyRestore') {
                        // Update the cache of preserved elements that will be
                        // restored on the next request that triggers a history save
                        let restored = event?.detail?.item?.content;
                        if (restored) {
                            let restoredDOM = new DOMParser().parseFromString(restored, "text/html");
                            if (restoredDOM) {
                                saveToCache(restoredDOM, 'now');
                            }
                        }
                    }
                }
            });
        })();

        // handle response error
        htmx.on('htmx:responseError', (event) => {
            // hard redirect to final path
            window.location.href=event.detail.pathInfo.finalPath;
        });

        // handle swap error
        htmx.on('htmx:swapError', (event) => {
            // hard redirect to final path
            window.location.href=event.detail.pathInfo.finalPath;
        });

        // This extension adds the X-Requested-With header to requests with the value "XMLHttpRequest".
        htmx.defineExtension('ajax-header', {
            onEvent: function (name, evt) {
                if (name === "htmx:configRequest") {
                    evt.detail.headers['X-Requested-With'] = 'XMLHttpRequest';
                }
            }
        });
    }
}