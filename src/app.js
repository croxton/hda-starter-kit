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
// import * as nav from "./scripts/modules/navigation.js";

// example of importing a module that you've added via `npm install`
// import Flickity from "flickity";

// jQuery test (jquery either autoloaded in webpack.mix.js or simply included via <script>)
$("#test-jquery").html("Hello. ");

// jQuery in a module test
import * as test from "./scripts/modules/test.js";
test.say("Is it me you're looking for?");

// Vue test
import Vue from "vue";
const app = new Vue({
    el: "#test-vue"
});
