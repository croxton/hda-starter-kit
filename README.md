# Laravel Mix, Tailwind CSS, Alpine.js + htmx starter config

A solid platform for front-end development, following the [Hypermedia Driven Application (HDA)](https://htmx.org/essays/hypermedia-driven-applications/) architecture.

Inspired by [Agency Webpack Mix Config](https://github.com/ben-rogerson/agency-webpack-mix-config).

* [Laravel Mix 6](https://laravel-mix.com/) / [Webpack 5](https://webpack.js.org/) / [PostCSS 8](https://postcss.org/)
* Development proxy with script and style injection (HMR, file watching)
* [htmx](https://htmx.org/) for HTML-over-the-wire 
* [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
* [Alpine.js](https://alpinejs.dev/) for composing behaviour directly in the markup
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

    
