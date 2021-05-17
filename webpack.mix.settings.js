// webpack.mix.settings.js - webpack settings config

// Webpack Mix settings exports
// noinspection WebpackConfigHighlighting
module.exports = {

    // Dev domain to proxy
    devProxyDomain: process.env.DEFAULT_SITE_URL || "https://laravel-mix-tailwind-starter.test",

    // Paths to observe for changes then trigger a full page reload
    devWatchPaths: ['./templates/**/*.twig', './templates/**/*.html'],

    // Port to use with webpack-dev-server
    devServerPort: 8080,

    // Folders where purgeCss can look for used selectors
    purgeCssGrabFolders: ["src", "templates"],

    // purgeCSS whitelists
    purgeCssWhitelist: ["html", "body", "h1", "h2", "h3", "h4", "h5", "h6", "fieldset", "label", "input"],

    // purgeCSS whitelists
    purgeCssWhitelistPatterns: [/^c-/],

    // purgeCSS extensions
    purgeCssExtensions: ["php", "twig", "html", "js", "mjs", "vue"],

    // Enable Filename hashing instead of query string for asset versioning?
    // Enable this if you use Twigpack or similar
    fileameHashing: false,

    // Optimise image sources? Note: can slow down rebuild times
    imagemin: false,

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

    // templates sources
    srcTemplates: "src/templates",

    // Shared vendor modules - empty params = separate all *used* node_modules
    vendor: [
        'axios',
        'focus-visible',
        'lazysizes',
        'lazy-scripts',
        'pubsub-js',
    ],

    // If you have more than one entry point for CSS/SCSS,
    // optionally combine the files in a specific order
    srcStyleFiles: [
        "main",
        "_tailwind.utilities",
    ],
};