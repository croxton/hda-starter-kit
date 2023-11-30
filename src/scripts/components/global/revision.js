/**
 * Revision
 *
 * Prompt user to hard-refresh the page when a new app bundle is deployed
 */

class Revision {
    constructor() {

        htmx.on('htmx:afterSwap', (htmxEvent) => {

            // the latest application revision value
            let revision = htmxEvent.detail.xhr.getResponseHeader('x-revision');

            // Revision header isn't set for Sprig requests
            if (revision) {
                // the revision value currently loaded for this client
                let currentRevision = revision;
                let metaRev = document.querySelector('meta[name="application-name"]');
                if (metaRev) {
                    currentRevision = metaRev.dataset.revision;
                    metaRev = null;
                }

                // New revision deployed, so we need to hard refresh - alert user with a dialog
                if (currentRevision !== revision) {
                    let html = document.getElementsByTagName("html")[0];
                    html.classList.add('is-revision');
                    html = null;
                }
            }
        });
    }
}

export default Revision;