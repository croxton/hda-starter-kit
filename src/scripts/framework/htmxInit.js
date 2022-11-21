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

            let historySnapshot, historySnapshotNext;
            let historyEltSelector = '[hx-history-elt]';

            htmx.defineExtension('history-preserve', {

                init : function() {

                    // Take a snapshot of the pristine markup on initial page load
                    // before it had been manipulated by JS
                    let historyElt = document.querySelector(historyEltSelector);
                    if (historyElt) {
                        historySnapshot = historyElt.innerHTML;
                    }
                },

                onEvent : function(name, event) {

                    if (name === "htmx:beforeSwap") {
                        // Take a snapshot of the initial dom state of a page before it is rendered.
                        // This is called *before* htmx:beforeHistorySave, so we need to save the
                        // snapshot for the *next* history save
                        let incomingDOM = new DOMParser().parseFromString(event.detail.xhr.response, "text/html");
                        let historyElt = incomingDOM.querySelector(historyEltSelector);
                        if (historyElt) {
                            historySnapshotNext = historyElt.innerHTML;
                        }
                    }

                    if (name === "htmx:beforeHistorySave") {
                        // Restore the pristine dom state of elements inside a container with attribute [hx-history-pristine]
                        // before htmx saves it to the history cache (localStorage)
                        if (historySnapshot) {
                            let markers = document.querySelectorAll(historyEltSelector + ' [hx-history-preserve]');
                            let pristineDom = new DOMParser().parseFromString(historySnapshot, "text/html");
                            let replace = pristineDom.querySelectorAll('[hx-history-preserve]');
                            for (let i = 0; i < markers.length; ++i) {
                                if (replace[i] !== undefined) {
                                    markers[i].innerHTML = replace[i].innerHTML;
                                }
                            }
                            if (historySnapshotNext) {
                                historySnapshot = historySnapshotNext;
                            } else {
                                historySnapshot = null;
                            }
                        }
                    }

                    if (name === 'htmx:historyRestore') {
                        // update the snapshot that will be saved
                        let restored = event?.detail?.item?.content;
                        if (restored) {
                            historySnapshot = restored;
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