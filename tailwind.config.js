module.exports = {
    mode: 'jit',
    purge: [
        './web/**/*.html',
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
