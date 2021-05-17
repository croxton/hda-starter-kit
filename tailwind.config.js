module.exports = {
    purge: {
        mode: 'jit', // 'all' for traditional Tailwind
        content: [
            './web/**/*.html',
            './templates/**/*.twig',
            './src/**/*.{js,jsx,ts,tsx,vue}',
            './src/**/*.{css,scss}',
        ],
        options: {
            safelist: ['show', 'collapse', 'collapsing', 'collapsed'],
            keyframes: true,
            fontFace: true,
        },
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
