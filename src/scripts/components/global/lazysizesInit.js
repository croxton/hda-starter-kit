/**
 * Lazysizes init
 */

import 'lazysizes';
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks';

class LazysizesInit {

    constructor() {

        // LazySizes: unveiling
        // Add a class to wrapping elements, such as <picture> to permit unveil animations
        document.addEventListener('lazybeforeunveil', (e)=> {
            let img = e.target;
            let picture = img.closest('[data-unveil]');
            if (picture) {
                picture.classList.add('is-lazyloaded');
            }
        });

        // LazySizes: check size of lazyloaded images with size="auto"
        // @see https://github.com/aFarkas/lazysizes#lazysizesautosizercheckelems
        // Only seems to be needed for Safari (BFCache bug?)
        htmx.on('htmx:historyRestore', (event) => {
            lazySizes.autoSizer.checkElems();
        });
    }
}

export default LazysizesInit;