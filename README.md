# Laravel Mix & Tailwind CSS Starter config

A solid platform for front-end development.

* Laravel Mix 6 / Webpack 5 / PostCSS 8
* Development proxy with script and style injection (HMR, file watching)  
* Tailwind CSS (JIT mode)
* SASS auto compiling, prefixing, minifying and sourcemaps
* CSS Autoprefixer, PostCSS Preset Env for older browsers
* Vue and/or jQuery, vanilla JS modules
* Polyfills for older browsers (Core-Js 3)  
* SVG icon sprites  
* Image optimisation
* Static files (fonts, images etc)
* Eslint
* Stylelint
* Sensible defaults, optimised for fast development rebuilds

To do:
* Critical CSS
* Legacy / modern bundles

## Requirements

Node 14+

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

Run the development build (with hot module reloading, linting and source maps)

    npm run check

Run the production build

    npm run build

Fix your javascript with eslint

    npm run fix-scripts

Fix your styles with stylelint

    npm run fix-styles   

View list of supported browsers for this project (see `package.json` to edit):

    npx browserslist

    
