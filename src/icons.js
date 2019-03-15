/* ============================================================================
   icons.js
   ========================================================================= */

/**
 * Contructs and icon sprite sheet
 * 
 * @author: Mark Croxton, mcroxton@hallmark-design.co.uk
 * @copyright: Hallmark Design
 */  

/* eslint-disable no-unused-vars */ 

// import all icons
function importAll(r) {
    return r.keys().map(r);
}
  
const icons = importAll(require.context("./icons", false, /\.(svg)$/));