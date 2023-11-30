/**
 * Lazysizes init
 */

import 'lazysizes';
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks';

class LazysizesInit {

    constructor() {
        // LazySizes: check size of lazyloaded images with size="auto"
        // @see https://github.com/aFarkas/lazysizes#lazysizesautosizercheckelems
        // Only seems to be needed for Safari (BFCache bug?)
        htmx.on('htmx:historyRestore', (event) => {
            lazySizes.autoSizer.checkElems();
        });
    }
}

export default LazysizesInit;