/*
 * Start
 *
 * Initialise our application
 */

/* component lazy loader */
import LoadComponents from './loadComponents';

/* global component imports */
import LazysizesInit from '../components/global/lazysizesInit';
import Metadata from '../components/global/metadata';
import ResizeDone from '../components/global/resizeDone';
import SvgIconSprite from '../components/global/svgIconSprite';

export default class Start {

    componentLoader = new LoadComponents();

    // initialise components
    constructor() {
        this.globalComponents();
        this.localComponents('main');
    }

    // Components that only need to be initialised ONCE on initial full page load:
    // - they target DOM elements in the page that don't change between htmx swaps
    // - or, they update their own state by using their own DOM mutation observer
    globalComponents() {
        new LazysizesInit();
        new Metadata();
        new ResizeDone();
        new SvgIconSprite();
    }

    // Lazy loaded components that have a lifecycle (mount/unmount/remount/update)
    localComponents(target = null) {

        /*
         Lazy load components the first time they enter any part of the DOM

         These components will:
         - mount() the first time they enter any part of the DOM
         - update() should they subsequently re-enter the DOM
         - persist in memory at a fixed size (they are not unmounted)

         Best used for common components that appear in multiple locations
         */
        this.componentLoader.load('share', '[data-share]', null, 'visible');

        /*
         Lazy load components when a selector enters the DOM within a swap target.

         These components will:
         - mount() when they initially enter the DOM within the target
         - unmount() if content subsequently swapped into the target DOES NOT contain them
         - remount() if content subsequently swapped into the target DOES contain them
         - only use memory when mounted in the DOM

         Optionally, the initial HTML state of elements identified by ID can be cached and
         automatically restored on remount with e.g. this.cache['#myId'] = my.innerHTML;

         Best used for one-off large or complex components that use significant memory
         */

        //this.componentLoader.load('locationMap','[data-map]', target, 'visible');
    }
}