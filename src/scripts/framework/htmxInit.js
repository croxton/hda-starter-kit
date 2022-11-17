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

        let historySnapshot, historySnapshotNext;
        let historyEltSelector = '[hx-history-elt]';

        // Take an snapshot of the pristine markup on initial page load
        // before it had been manipulated by JS
        let historyElt = document.querySelector(historyEltSelector);
        if (historyElt) {
            historySnapshot = historyElt.innerHTML;
        }

        htmx.on('htmx:beforeSwap', (event) => {
            // Take a snapshot of the initial dom state of a page before it is rendered.
            // This is called *before* htmx:beforeHistorySave, so we need to save the
            // snapshot for the *next* history save
            let incomingDOM = new DOMParser().parseFromString(event.detail.xhr.response, "text/html");
            let historyElt = incomingDOM.querySelector(historyEltSelector);
            if (historyElt) {
                historySnapshotNext = historyElt.innerHTML;
            }
        });

        htmx.on('htmx:beforeHistorySave', (event) => {
            // restore the pristine dom state before htmx saves it to the history cache (localStorage)
            if (historySnapshot) {
                let historyElt = document.querySelector(historyEltSelector);
                if (historyElt) {
                    historyElt.innerHTML = historySnapshot;
                    if (historySnapshotNext) {
                        historySnapshot = historySnapshotNext;
                    } else {
                        historySnapshot = null;
                    }
                }
            }
        });

        htmx.on('htmx:historyRestore', (event) => {
            // update the snapshot that will be saved
            let restored = event?.detail?.item?.content;
            if (restored) {
                historySnapshot = restored;
            }
        });

        // handle response error
        htmx.on('htmx:responseError', function(event) {
            // hard redirect to final path
            window.location.href=event.detail.pathInfo.finalPath;
        });

        // handle swap error
        htmx.on('htmx:swapError', function(event) {
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