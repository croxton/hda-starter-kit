/**
 * ===========================
 * Webpack-Mix config
 * ===========================
 *
 * Contents
 *
 * 🎚️ Settings
 * 🎭 Hashing
 * 🎨 Styles
 * 🎨 Styles: PostCSS
 * 🎨 Styles: Polyfills
 * 🎨 Styles: Vendor
 * 🎨 Styles: Other
 * 📑 Scripts
 * 📑 Scripts: Polyfills
 * 📑 Scripts: Auto import libraries
 * 📑 Scripts: Linting
 * 🏞 Images
 * 🎆 Icons
 * 🗂️ Static
 * 🚧 Webpack-dev-server
 */

// 🎚️ Base config
const config = require('./webpack.mix.settings.js');

// 🎚️ Imports
const mix = require("laravel-mix");
const path = require("path");
const globby = require("globby");

// 🎚️ Source folders
const source = {
    icons: path.resolve(config.srcIcons),
    images: path.resolve(config.srcImages),
    scripts: path.resolve(config.srcScripts),
    styles: path.resolve(config.srcStyles),
    static: path.resolve(config.srcStatic),
};

// 🎚️ Misc
mix.setPublicPath(config.publicFolder)
mix.disableNotifications()
mix.webpackConfig({ resolve: { alias: source } })

// 🎚️ Source maps
if (process.env.SOURCE_MAPS === 'true') {
    mix.sourceMaps()
}

/**
 * 🎭 Hashing
 */
if (mix.inProduction()) {

    // Allow versioning in production
    mix.version()

    /* Make sure dynamically imported chunks are versioned too */
    mix.webpackConfig({
        output: {
            chunkFilename: config.publicBuildFolder + '/[name].js?id=[chunkhash]',
        }
    });
}

/**
 * 🎨 Styles: Main
 * https://laravel-mix.com/docs/6.0/sass
 */
// Get a list of style files within the base styles folder
let styleFiles = globby.sync(`${source.styles}/*.{scss,sass}`);

// Create an asset for every style file
styleFiles.forEach(styleFile => {
    mix.sass(
        styleFile,
        path.join(config.publicFolder, config.publicBuildFolder)
    )
});

/**
 * 🎨 Styles: PostCSS
 * Extend Css with plugins
 */
const postCssPlugins = [
    // https://tailwindcss.com/docs/guides/laravel#configure-tailwind-with-laravel-mix
    require('tailwindcss')('./tailwind.config.js'),

    /**
     * 🎨 Styles: Polyfills
     * Postcss preset env lets you use pre-implemented css features
     * See https://cssdb.org/ for supported features
     * https://github.com/csstools/postcss-preset-env#readme
     */
    require("postcss-preset-env")({
        stage: 1,
        features: {
            'focus-within-pseudo-class': false
        }
    }),
];
mix.options({ postCss: postCssPlugins });


/**
 * 🎨 Styles: Other
 * https://laravel-mix.com/docs/6.0/api#optionsoptions
 */
mix.options({
    // Disable processing css urls for speed
    // https://laravel-mix.com/docs/4.0/css-preprocessors#css-url-rewriting
    processCssUrls: false,

    // Disable calc because it's buggy with nested parentheses
    cssNano: {calc: false}
});

/**
 * 📑 Scripts: Main
 * Script files are transpiled to vanilla JavaScript
 * https://laravel-mix.com/docs/6.0/mixjs
 */
const scriptFiles = globby.sync(`${source.scripts}/*.{js,mjs}`);
scriptFiles.forEach(scriptFile => {
    mix.js(scriptFile, config.publicBuildFolder).vue()
});

/**
 * 📑 Scripts: Polyfills
 * Automatically add polyfills for target browsers with core-js@3
 * See "browserslist" in package.json for your targets.
 * Note that this only polyfills your scripts, NOT scripts imported from node_modules
 * https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md
 * https://github.com/scottcharlesworth/laravel-mix-polyfill#options
 */
require("laravel-mix-polyfill");
mix.polyfill({
    enabled: mix.inProduction(),
    useBuiltIns: "usage", // Only add a polyfill when a feature is used
    targets: false, // "false" makes the config use browserslist targets in package.json
    corejs: 3,
    debug: false, // "true" to check which polyfills are being used
});

/**
 * 📑 Scripts: Auto import libraries
 * Make JavaScript libraries available without an import
 * https://laravel-mix.com/docs/6.0/autoloading
 */
mix.autoload({
    jquery: ["$", "jQuery", "window.jQuery"],
});

/**
 * 📑 Scripts: Vendor
 * Separate the JavaScript code imported from node_modules
 * https://laravel-mix.com/docs/6.0/extract
 */
if (!mix.inProduction()) {
    mix.extract([])
} else {
    mix.extract(config.vendor) // Specify exact packages to add to the vendor file
}

/**
 * 📑 Scripts: Linting
 */
if (process.env.LINT === 'true' && !mix.inProduction()) {
    require("laravel-mix-eslint");
    mix.eslint();
}

/**
 * 🏞 Images
 * Images are optimized and copied to the build directory
 * https://github.com/Klathmon/imagemin-webpack-plugin#api
 */
if (config.imagemin) {
    require("laravel-mix-imagemin");
    mix.imagemin(
        {
            from: path.join(source.images, "**/*"),
            to: config.publicBuildFolder,
            context: config.srcImages,
        },
        {},
        {
            gifsicle: {interlaced: true},
            mozjpeg: {progressive: true, arithmetic: false},
            optipng: {optimizationLevel: 3}, // Lower number = speedier/reduced compression
            svgo: {
                plugins: [{
                    name: 'preset-default',
                    params: {
                        overrides: {
                            convertPathData: false,
                            convertColors: {currentColor: false},
                            removeViewBox: false,
                            cleanupIDs: false
                        },
                        removeDimensions: true,
                    }
                }],
            },
        }
    )
}

/**
 * 🎆 Icons
 * Individual SVG icons are optimised then combined into a single cacheable SVG
 * https://github.com/kisenka/svg-sprite-loader#configuration
 */
if (config.icons) {
    require("laravel-mix-svg-sprite");
    mix.svgSprite(source.icons, path.join(config.publicBuildFolder, "sprite.svg"), {
        symbolId: filePath => `icon-${path.parse(filePath).name}`,
        extract: true,
    });

    // Icon options
    mix.options({
        imgLoaderOptions: {
            svgo: {
                plugins: [
                    {
                    name: 'preset-default',
                    params: {
                        overrides: {
                            convertColors: {currentColor: false},
                            removeViewBox: false,
                        }
                    },
                    removeDimensions: true,
                }],
            },
        },
    });
}

/**
 * 🗂️ Static
 * Additional folders with no transform requirements are copied to your build folders
 */
mix.copyDirectory(
    source.static,
    path.join(config.publicFolder, config.publicBuildFolder)
);

/**
 * 🚧 Webpack-dev-server (v4.0.0-beta.2)
 */
const chokidar = require('chokidar');

mix.options({
    hmrOptions: {
        https: config.devProxyDomain.includes("https://"),
        host: "localhost",
        port: config.devServerPort
    }
});

// @see https://github.com/webpack/webpack-dev-server/issues/3121
mix.webpackConfig({
    devServer: {
        onBeforeSetupMiddleware(server) {
            chokidar.watch(config.devWatchPaths, {
                    alwaysStat: true,
                    atomic: false,
                    followSymlinks: false,
                    ignoreInitial: true,
                    ignorePermissionErrors: true,
                    persistent: true,
                    usePolling: true,
                }
            ).on('all', () => {
                server.sendMessage(server.webSocketServer.clients, "content-changed");
            })
        },
        open: true,
        allowedHosts: [config.devProxyDomain],
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        proxy: {
            "**": {
                target: config.devProxyDomain,
                changeOrigin: true,
                secure: false,
            },
        },
    },
});