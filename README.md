# Hypermedia Driven Application starter kit

A solid platform for front-end development, following the [Hypermedia Driven Application (HDA)](https://htmx.org/essays/hypermedia-driven-applications/) architecture and the [Locality of Behaviour](https://htmx.org/essays/locality-of-behaviour/) (LoB) principle.

Includes a working demo featuring full page transitions and example `Alpine.js`, `Vue 3` and vanilla JS components.

* [Laravel Mix 6](https://laravel-mix.com/) / [Webpack 5](https://webpack.js.org/) / [PostCSS 8](https://postcss.org/) - provides a robust ES6 development environment with script and style injection (HMR, file watching)
* [htmx](https://htmx.org/) for HTML-over-the-wire 
* [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
* [Alpine.js](https://alpinejs.dev/) + [Async Alpine](https://github.com/Accudio/async-alpine) for composing behaviour directly in markup, with support for asynchronous on-demand components
* [Vue.js](https://vuejs.org/) (v3) for complex reactive applications using SFCs
* Minimalistic JavaScript framework for vanilla JS components:
  * Components can be lazyloaded as they enter the DOM and use loading strategies including `visible`, `idle` and `media`
  * Framework-agnostic - works with vanilla JS, Vue, jQuery, GSAP, Alpine.js or your framework of choice; any third party script can be integrated into the simple component lifecycle
* SASS auto compiling, prefixing, minifying and sourcemaps
* CSS Autoprefixer, PostCSS Preset Env for older browsers
* Polyfills for older browsers (Core-Js 3)  
* SVG icon sprites  
* Image optimisation
* Static files (fonts, images etc)
* Eslint
* Stylelint
* Sensible defaults, optimised for fast development rebuilds

## Requirements

Node 16+

## Install

	npm install

* Review the settings in `webpack.mix.settings.js` and `tailwind.config.php`, and customise for your project.

* Create an `.env`  file and add an environment variable `DEFAULT_SITE_URL` pointing to the hostname of your local website.

```dotenv
DEFAULT_SITE_URL=mywebsite.test
```

## Run your desired workflow:

Run the development server (with hot module reloading and file watching)

    npm run dev

Run the development server (with linting and source maps)

    npm run debug

Run the production build

    npm run build

Fix your javascript with eslint

    npm run fix-scripts

Fix your styles with stylelint

    npm run fix-styles   

View list of supported browsers for this project (see `package.json` to edit):

    npx browserslist

## Front-end development

Our aim is to keep markup and logic (styling / scripting) together in one file, wherever possible, and this starter kit gives you some great tools to start with simply by editing html. Realistically however, this isn't always possible or desirable as the complexity of an application increases: sometimes we need units of behaviour or style to be separated as individual components that map to elements in the markup. Ideally, these components should be as self-contained and expressive as possible, so they remain readable and composable.

This kit gives you the flexibility to find a pragmatic balance between Locality of Behaviour (LoB) and Separation of Concerns (SoC) that suits your project and preferences.

## Styling
You may need to create bespoke styles for UI states that can't easily be expressed with Tailwind CSS classes. This kit allows you to organise these in a [ITCSS](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)-inspired folder hierarchy, and use [SASS](https://sass-lang.com/) as much or as little as you wish.

* **Settings** – global variables, config switches etc.
* **Functions** – globally used functions.
* **Mixins** – globally used mixins.
* **Base** – styling for bare HTML elements (like BODY, H1, A, etc.).
* **Objects** – class-based selectors which define undecorated, design patterns, intended to be reusable between projects (e.g. `.o-ratio`).
* **Layouts** – layout grids and containers (e.g. `.l-container`).
* **Vendor** - third party component stylesheets
* **Components** – specific UI components  (e.g. `.c-button`).
* **Utils** – utilities and helper classes with ability to override anything which goes before (e.g. `.h1`).

## Scripting
`Alpine.js` allows you to express UI component behaviour directly in markup, but sometimes you may need to isolate behaviour in an individual component and load it asynchronously on demand rather than in one big script bundle up-front. This kit allows you to use Alpine Async components, Vue SFCs or roll your own vanilla JS components. The later can be used to load heavy third-party libraries like GSAP in a memory-efficient manner, by wrapping them in a `mount()` / `unmount()` lifecycle.

### `framework/start.js`
This file controls the components you wish to load, and the selectors they map to.

####  `globalComponents()`
Global components are loaded once on initial page load. They manage the state of site-wide elements and behaviours like the main menu, `<head>` metadata and window resize events. Create global components in `framework/components/global`.

#### `localComponents()`
Vanilla JS components are loaded on demand in content swapped into a target by htmx, such as `<main>`. Create local components in `framework/components/local` and attach to elements with `data-component="myComponent"`. Determine the loading strategy for the component instance with `data-load=""`.

The component can appear once or multiple times in your markup, with each instance respecting the loading strategy specified for the element it is mounted on. Regardless of the number of instances, the component's script (split into an individual chunk file by Webpack) will only be requested once - when the component is first encountered. 

For example, if you create a component class at `framework/components/local/myComponent.js`, you can use it in your html like this:

```html
<div id="a-unique-id" data-component="myComponent" data-load="visible"></div>
<div id="another-unique-id" data-component="myComponent" data-load="media (min-width: 1024px)"></div>
```

Each instance *must* have a unique ID.

If the element contains markup that is manipulated by the component you have created, preserve the initial markup state for history restores by using the `hx-history-preserve` attribute. For example, a component matching the `[data-component="carousel"]` selector that uses [Swiper.js](https://swiperjs.com/) to generate a carousel: 

```html
<div id="my-carousel" class="swiper" data-component="carousel" hx-history-preserve>
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
    <div class="swiper-slide">Slide 3</div>
  </div>
  <div class="swiper-pagination"></div>
</div>
```

It is also possible to manually load a specific component and attach to a selector in `start.js`. When the selector enters the dom, the component will be loaded and mounted using the selected strategy:

```js
this.componentLoader.load('share', '[data-share]', 'visible');
```

#### `asyncAlpineComponents()`
Asynchronous Alpine components can be loaded anywhere in your markup. Create Alpine components in `framework/components/alpine`. See `components/alpine/message.js` for an example.

In `start.js`:

```js
AsyncAlpine.data("message", () => import("../components/alpine/message.js"));
```

In your html:
```html
  <div
    ax-load="visible"
    x-data="message('Component loaded with Async Alpine using the `visible` strategy')"
    x-ignore
  </div>
```

For instructions see [Async Alpine](https://github.com/Accudio/async-alpine).

#### `vueComponents()`
Vue components are loaded on demand in content swapped by htmx, such as `<main>`. Create components in `framework/components/vue`, and attach to elements with `data-vue-component="MyComponent"`. Determine the loading strategy for the component with `data-load=""`, and pass props via additional `data-` attributes.

No initialisation step is required for Vue components, they are loaded and mounted automatically on demand as individual Vue application instances.

See `components/vue/LocationMap.js` for an example.

```html
<div 
  id="map-london" 
  data-vue-component="LocationMap" 
  data-load="visible" 
  data-latitude="51.509865" 
  data-longitude="-0.118092" 
  data-caption="A map of London">
</div>
 ```

For more, see [Vue SFCs](https://vuejs.org/guide/scaling-up/sfc.html)

### Loading strategies
Components support the following loading strategies. The loading strategy for local components is determined in `start.js`. Alpine components can use the `ax-load` attribute directly in the markup, and vue components can use the `data-load` attribute. The default strategy is `eager`.

#### Eager
The default strategy if not specified. If the component is present in the page on initial load, or in content swapped into the dom by htmx, it will be loaded and mounted immediately.

#### Visible
Uses IntersectionObserver to only load when the component is in view, similar to lazy-loading images. Optionally, custom root margins can be provided in parentheses.

```js
this.componentLoader.load('share', '[data-share]', 'visible (100px 100px 100px 100px)');
```

#### Media
The component will be loaded when the provided media query evaluates as true.

```js
this.componentLoader.load('share', '[data-share]', 'media (max-width: 820px)');
```

#### Idle
Uses requestIdleCallback (where supported) to load when the main thread is less busy.

```js
this.componentLoader.load('share', '[data-share]', 'idle');
```

#### Event
Alpine async components only. The component won't be loaded until it receives the `async-alpine:load` event on window. Provide the id of the component in `detail.id`. See: https://async-alpine.dev/docs/strategies/#event.
 

#### Combined strategies
Strategies can be combined by separating with a pipe |, allowing for advanced and complex code splitting:

```js
this.componentLoader.load('share', '[data-share]', 'idle | visible | media (min-width: 1024px)');
```

### Creating your own local components

Local component classes must extend `framework/baseComponent.js` and have `mount()` and `unmount()` methods. See `components/local/share.js` for an example.

#### `mount()`
Use this method to initialise your component. A component would typically map to one element and manipulate the markup within it. Use publish/subscribe topics if to orchestrate multiple component instances.

#### `umount()`
Use this method to remove any references to elements in the DOM so that the browser can perform garbage collection and release memory.
Remove any event listeners and observers that you created. The framework automatically tracks event listeners added to elements and provides a convenience function `clearEventListeners()` that can clean things up for you.

```html
<div id="my-thing-1" data-component="myThing"></div>
```

`components/local/myThing.js`:

```js
import BaseComponent from '../../framework/baseComponent';

export default class MyThing extends BaseComponent {
    
    constructor(elm) {
        super(elm);
        this.mount();
    }

    mount() {
        // setup and mount your component instance
        let thing = document.querySelector(this.elm); // [data-thing]
      
        // do stuff with the thing!
    }

    unmount() {
        if (this.mounted) {
          // unset references to DOM nodes
          // and remove any event listeners or observers you created
        }
    }
}
```

### Event bus
For communication *between* components, the kit comes with [PubSubJS](https://github.com/mroderick/PubSubJS), a topic-based publish/subscribe library.

Example use:

```js
import PubSub from 'pubsub-js';

// subscribe to 'video.play'
let topic = 'video.play';
let subscriber = PubSub.subscribe(topic, (msg, id) => {
    if (id !== player.plyId) {
        player.pause();
    }
});

player.on('play', event => {
    this.videoMount.classList.add('is-playing');
    // pause any other videos mounted on the page that are playing
    PubSub.publish(topic, player.plyId);
});
        
```

Be sure to unsubscribe to topics in `unmount()`:

```js
 // unsubscribe
 PubSub.unsubscribe(subscriber);
```

## Thank you
Inspired by [Agency Webpack Mix Config](https://github.com/ben-rogerson/agency-webpack-mix-config).