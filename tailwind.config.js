module.exports = {
    mode: 'jit',
    content: [
        './web/index.html',
        './web/page2.html',
        './web/page3.html',
        './templates/**/*.twig',
        './src/**/*.{js,jsx,ts,tsx,vue}',
        './src/**/*.{css,scss}',
    ],
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
