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