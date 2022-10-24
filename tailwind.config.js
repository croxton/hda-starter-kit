module.exports = {
    mode: 'jit',
    content: [
        './web/index.html',
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
