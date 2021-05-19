/* ============================================================================
   app.js
   ========================================================================= */

/**
 * Main script bundle used throughout the website
 *
 * @author: Mark Croxton, mcroxton@hallmark-design.co.uk
 * @copyright: Hallmark Design
 */

/* eslint-disable no-unused-vars */

// example of importing one of your own modules:
// import * as nav from "./modules/navigation";

// SVG icon sprites
import "./modules/svgIconSprite";

// Lazy loaded images
// @see https://github.com/aFarkas/lazysizes
import 'lazysizes';

// Lazy loaded scripts
// @see https://github.com/djpogo/lazy-scripts
import LazyScripts from 'lazy-scripts';
new LazyScripts();
console.log('test');

// Publishes a 'resizeDone' event triggered when window resizing is complete.
// Components can subscribe to it to update their state.
// Also sets a --windowHeight css variable for use in CSS, instead of 100vh
import "./modules/resizeDone";

// jQuery example (jquery either autoloaded in webpack.mix.js or simply included via <script>)
$("#test-jquery").html("Hello. ");

// jQuery in a module example
import * as test from "./modules/test.js";
test.say("Is it me you're looking for?");

// Vue example
import Vue from "vue";
Vue.config.productionTip = false;
const main = new Vue({
    el: "#test-vue"
});

// Accept HMR
// https://webpack.js.org/api/hot-module-replacement#accept
if (module.hot) {
    module.hot.accept();
}
