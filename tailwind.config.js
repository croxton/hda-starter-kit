module.exports = {
    mode: 'jit',

    // Be careful of infinite loops!
    // See https://tailwindcss.com/docs/just-in-time-mode#styles-rebuild-in-an-infinite-loop
    purge: [
        './web/index.html',
        './templates/**/*.twig',
        './src/**/*.{js,jsx,ts,tsx,vue}',
        './src/**/*.{css,scss}',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
