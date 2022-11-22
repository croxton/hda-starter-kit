/*
 * Start
 *
 * Initialise our application
 */

/* component lazy loader */
import LoadComponents from './loadComponents';
import AsyncAlpine from 'async-alpine';
import Alpine from 'alpinejs'

/* global component imports */
import LazysizesInit from '../components/global/lazysizesInit';
import Menu from '../components/global/menu';
import Metadata from '../components/global/metadata';
import ResizeDone from '../components/global/resizeDone';
import SvgIconSprite from '../components/global/svgIconSprite';

export default class Start {

    componentLoader = new LoadComponents();

    // initialise components
    constructor() {
        this.globalComponents();
        this.localComponents();
        this.alpineComponents();
        this.vueComponents();
    }

    // Components that only need to be initialised ONCE on initial full page load:
    // - they target DOM elements in the page that don't change between htmx swaps
    // - or, they update their state by using their own DOM mutation observer
    globalComponents() {
        new LazysizesInit();
        new Menu();
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

    // Asynchronous Alpine components
    // @see https://async-alpine.dev/
    alpineComponents() {
        AsyncAlpine.init(Alpine);
        AsyncAlpine.data("message", () => import("../components/alpine/message.js"));
        AsyncAlpine.start();
        Alpine.start();
    }

    // Vue SFCs
    vueComponents() {
        this.componentLoader.load('vueBridge', '[data-vue-component]');
    }
}