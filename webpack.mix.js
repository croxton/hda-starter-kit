let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

// dependencies
var tailwindcss = require('tailwindcss');
require('laravel-mix-purgecss');
require('laravel-mix-eslint');

// autoload primary js libraries
// note: don't do this, use Vue or jQuery, not both
mix.autoload({
    jquery: ['$', 'window.jQuery'],
    vue: ['Vue', 'window.Vue']
});

// app bundle 
// extract vendor modules to be compiled to vendor.js
mix.js('src/app.js', 'web/dist/')
    .eslint({
        fix: false,
        cache: false
    })
    .extract(['jquery', 'vue']);

// vendor scripts bundle, if you want to manually manage these
// rather than use use `npm install` and extract() them as above
//mix.babel([
//    'src/scripts/vendor/console.js'
//], 'web/dist/vendor.js');

// icon sprite
// this adds a redundant icons.js
require('laravel-mix-svg-sprite');
mix.svgSprite('src/icons', 'web/dist/sprite.svg');
mix.js('src/icons.js', 'web/dist/');

// SASS & Tailwind
mix.sass('src/app.scss', 'web/dist/')
    .options({
        processCssUrls: false,
        postCss: [ tailwindcss('./tailwind.js') ],
    });
mix.purgeCss({ folders: ['app/templates/', 'web'], extensions: ['twig', 'html'] });

// move fonts
mix.copyDirectory('src/fonts/', 'web/dist/fonts/');

// browserSync - loads site at http://localhost:3000
// can't get proxy to work :(
mix.browserSync({
    server: {
      baseDir: "./web/"
    },
    files: [
        'web/dist/{*,**/*}.css',
        'web/dist/{*,**/*}.js',
        'web/{*,**/*}.html',
        'templates/{*,**/*}.twig'
    ],
    proxy: false
});

// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.preact(src, output); <-- Identical to mix.js(), but registers Preact compilation.
// mix.coffee(src, output); <-- Identical to mix.js(), but registers CoffeeScript compilation.
// mix.ts(src, output); <-- TypeScript support. Requires tsconfig.json to exist in the same folder as webpack.mix.js
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.less(src, output);
// mix.stylus(src, output);
// mix.postCss(src, output, [require('postcss-some-plugin')()]);
// mix.browserSync('my-site.test');
// mix.combine(files, destination);
// mix.babel(files, destination); <-- Identical to mix.combine(), but also includes Babel compilation.
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.
// mix.babelConfig({}); <-- Merge extra Babel configuration (plugins, etc.) with Mix's default.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.dump(); <-- Dump the generated webpack config object t the console.
// mix.extend(name, handler) <-- Extend Mix's API with your own components.
// mix.options({
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   globalVueStyles: file, // Variables file to be imported in every component.
//   processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//   purifyCss: false, // Remove unused CSS selectors.
//   terser: {}, // Terser-specific options. https://github.com/webpack-contrib/terser-webpack-plugin#options
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
