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
 * 🎨 Styles: PurgeCSS
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
    templates: path.resolve(config.srcTemplates),
};

// 🎚️ Misc
mix.setPublicPath(config.publicFolder)
mix.disableNotifications()
mix.webpackConfig({ resolve: { alias: source } })

// 🎚️ Source maps
if (process.env.SOURCE_MAPS == 'true') {
    mix.sourceMaps()
}

/**
 * 🎭 Hashing (for non-static sites)
 * Mix has querystring hashing by default, eg: main.css?id=abcd1234
 * This script converts it to filename hashing, eg: main.abcd1234.css
 * https://github.com/JeffreyWay/laravel-mix/issues/1022#issuecomment-379168021
 */
if (mix.inProduction() && config.filenameHashing) {
    // Allow versioning in production
    mix.version()
    // Get the manifest filepath for filehash conversion
    const manifestPath = path.join(config.publicFolder, "mix-manifest.json");
    // Run after mix finishes
    mix.then(() => {
        const laravelMixMakeFileHash = require("laravel-mix-make-file-hash");
        laravelMixMakeFileHash(config.publicFolder, manifestPath)
    })
}

/**
 * 🎨 Styles: Main
 * Uses dart-sass which has a replica API to Node-Sass
 * https://laravel-mix.com/docs/4.0/css-preprocessors
 * https://github.com/sass/node-sass#options
 */
// Get a list of style files within the base styles folder
let styleFiles;
if (config.srcStyleFiles.length) {
    styleFiles = config.srcStyleFiles.map(i => source.styles + '/' + i + '.scss');
} else {
    styleFiles = globby.sync(`${source.styles}/*.{scss,sass}`);
}

// Create an asset for every style file
styleFiles.forEach(styleFile => {
    mix.sass(
        styleFile,
        path.join(config.publicFolder, config.publicBuildFolder)
    )
});

/**
 * 🎨 Styles: PurgeCSS
 * https://github.com/spatie/laravel-mix-purgecss#usage
 */
if (config.purgeCssGrabFolders.length) {
    require("laravel-mix-purgecss")
    mix.purgeCss({
        enabled: mix.inProduction(),
        folders: config.purgeCssGrabFolders, // Folders scanned for selectors
        whitelist: config.purgeCssWhitelist,
        whitelistPatterns: config.purgeCssWhitelistPatterns,
        extensions: config.purgeCssExtensions,
    })
}

/**
 * 🎨 Styles: PostCSS
 * Extend Css with plugins
 * https://laravel-mix.com/docs/4.0/css-preprocessors#postcss-plugins
 */
const postCssPlugins = [
    // https://tailwindcss.com/docs/installation/#laravel-mix
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
 * https://laravel-mix.com/docs/4.0/options
 */
mix.options({
    // Disable processing css urls for speed
    // https://laravel-mix.com/docs/4.0/css-preprocessors#css-url-rewriting
    processCssUrls: false,
});

// combine the CSS entry points into a single file
if (mix.inProduction()) {
    const buildFolder = path.join(config.publicFolder, config.publicBuildFolder);
    const combineFilesArr = config.srcStyleFiles.map(i => buildFolder + '/' + i + '.css');
    mix.combine(combineFilesArr, buildFolder + '/global.css');
}

/**
 * 📑 Scripts: Main
 * Script files are transpiled to vanilla JavaScript
 * https://laravel-mix.com/docs/4.0/mixjs
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
 * https://laravel-mix.com/docs/4.0/autoloading
 */
mix.autoload({
    jquery: ["$", "jQuery", "window.jQuery"],
});

/**
 * 📑 Scripts: Vendor
 * Separate the JavaScript code imported from node_modules
 * https://laravel-mix.com/docs/4.0/extract
 * Without mix.extract you'll see an annoying js error after
 * launching the dev server - this should be fixed in webpack 5
 */
if (!mix.inProduction()) {
    mix.extract([])
} else {
    mix.extract(config.vendor) // Specify exact packages to add to the vendor file
}

/**
 * 📑 Scripts: Linting
 */
if (process.env.LINT == 'true' && !mix.inProduction()) {
    require("laravel-mix-eslint");
    mix.eslint();
}

/**
 * 🏞 Images
 * Images are optimized and copied to the build directory
 * https://github.com/Klathmon/imagemin-webpack-plugin#api
 */
if (config.imagemin) {
    require("laravel-mix-imagemin")
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
                plugins: [
                    {convertPathData: false},
                    {convertColors: {currentColor: false}},
                    {removeDimensions: true},
                    {removeViewBox: false},
                    {cleanupIDs: false},
                ],
            },
        }
    )
}

/**
 * 🎆 Icons
 * Individual SVG icons are optimised then combined into a single cacheable SVG
 * https://github.com/kisenka/svg-sprite-loader#configuration
 */
require("laravel-mix-svg-sprite")
mix.svgSprite(source.icons, path.join(config.publicBuildFolder, "sprite.svg"), {
    symbolId: filePath => `icon-${path.parse(filePath).name}`,
    extract: true,
});

// Icon options
mix.options({
    imgLoaderOptions: {
        svgo: {
            plugins: [
                { convertColors: { currentColor: true } },
                { removeDimensions: false },
                { removeViewBox: false },
            ],
        },
    },
});

/**
 * 🗂️ Static
 * Additional folders with no transform requirements are copied to your build folders
 */
mix.copyDirectory(
    source.static,
    path.join(config.publicFolder, config.publicBuildFolder)
);

/**
 * 🚧 Webpack-dev-server
 * https://webpack.js.org/configuration/dev-server/
 */
const chokidar = require('chokidar');

mix.options({
    hmrOptions: {
        https: config.devProxyDomain.includes("https://"),
        host: "localhost",
        port: config.devServerPort
    }
});
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
            ).on('all', function() {
                server.sockWrite(server.sockets, "content-changed");
            })
        },
        open: true,
        firewall: false, // Fixes "Invalid Host header error" on assets
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