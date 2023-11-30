/* ============================================================================
   app.js
   ========================================================================= */

/**
 * Main script bundle used throughout the website
 *
 * @author: Mark Croxton, mcroxton@hallmark-design.co.uk
 * @copyright: Hallmark Design
 */

/* import framework */
import "./framework/getEventListeners";
import HtmxInit from './framework/htmxInit';
import Start from './framework/start';

// .no-js to .js
let html = document.getElementsByTagName("html")[0];
html.className = html.className.replace("no-js", "js");

// Initialise htmx
if (typeof htmx != "undefined") {
    new HtmxInit();
}

// Bootstrap our js framework
new Start();

// Accept HMR
// https://webpack.js.org/api/hot-module-replacement#accept
if (module.hot) {
    module.hot.accept();
}
