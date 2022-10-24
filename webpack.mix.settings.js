// webpack.mix.settings.js - webpack settings config

// Webpack Mix settings exports
// noinspection WebpackConfigHighlighting
module.exports = {

    // Dev domain to proxy
    devProxyDomain: process.env.DEFAULT_SITE_URL || "https://laravel-mix-tailwind-starter.test",

    // Paths to observe for changes then trigger a full page reload
    devWatchPaths: ['./templates/**/*.twig', './templates/**/*.html', './web/*.html'],

    // Port to use with webpack-dev-server
    devServerPort: 8080,

    // Optimise image sources? Note: can slow down rebuild times
    imagemin: false,

    // Create icon sprites?
    icons: true,

    // Urls for CriticalCss to look for "above the fold" Css
    criticalCssUrls: [
        { urlPath: "/", label: "index" },
        // { urlPath: "/about", label: "about" },
    ],

    // Folder served to users
    publicFolder: "web",

    // Folder name for built src assets (publicFolder base)
    publicBuildFolder: "dist",

    // scripts source
    srcScripts: "src/scripts",

    // styles sources
    srcStyles: "src/styles",

    // icons sources
    srcIcons: "src/icons",

    // images sources
    srcImages: "src/images",

    // static sources
    srcStatic: "src/static",

    // Shared vendor modules - empty params = separate all *used* node_modules
    vendor: [
        'lazysizes',
        'lazy-scripts',
        'pubsub-js'
    ],
};