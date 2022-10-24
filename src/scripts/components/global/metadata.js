/**
 * Metadata
 *
 * Update <head> metadata from the newly swapped page
 */

class Metadata {
    constructor() {
        htmx.on('htmx:beforeSwap', (htmxEvent) => {
            let incomingDOM = new DOMParser().parseFromString(htmxEvent.detail.xhr.response, "text/html");
            // Transpose <meta> data, page-specific <link> tags and JSON-LD structured data
            // Note that hx-boost automatically swaps the <title> tag
            let selector = "head > meta:not([data-revision]), head *[rel=\"canonical\"], head *[rel=\"alternate\"], body script[type=\"application/ld+json\"]";
            document.querySelectorAll(selector).forEach((e) => {
                e.parentNode.removeChild(e);
            });
            incomingDOM.querySelectorAll(selector).forEach((e) => {
                if (e.tagName === 'SCRIPT') {
                    document.body.appendChild(e);
                } else {
                    document.head.appendChild(e);
                }
            })
        });
    }
}

export default Metadata;