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
        this.localComponents();
    }

    // Components that only need to be initialised ONCE on initial full page load:
    // - they target DOM elements in the page that don't change between htmx swaps
    // - or, they update their state by using their own DOM mutation observer
    globalComponents() {
        new LazysizesInit();
        new Metadata();
        new ResizeDone();
        new SvgIconSprite();
    }

    // Lazy loaded components in htmx swapped content that have:
    // - a lifecycle (mount | unmount)
    // - an optional loading strategy (idle | media | visible)
    localComponents() {
        this.componentLoader.load('share', '[data-share]', 'visible');
    }
}