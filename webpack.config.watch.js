const path = require( 'path' );
module.exports = function(config = {}) {
    let debug = !!config.debug;
    return {
        devtool: debug && 'cheap-module-eval-source-map',
        mode: debug ? 'development' : 'production',
        watch: debug,
        entry: {
            clipboard: './static/webpack/clipboard/index.js'
        },
        module: {
            rules: [
                // All files that end on .js or .jsx are transpilled by babel
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules)/,
                    use: [
                        'thread-loader',
                        {
                            loader: 'babel-loader',
                            query: {
                                presets: [
                                    ["env", {
                                        "targets": {
                                            "chrome": 52
                                        }
                                    }]
                                ],
                                plugins: [
                                    "transform-react-jsx", 
                                    "transform-class-properties", 
                                    "transform-decorators-legacy",
                                    ["transform-object-rest-spread",
                                        {
                                        "useBuiltIns": true
                                        }
                                    ],
                                ]
                            },
                        },
                    ]
                },
                {
                    test: /\.(jpe?g|png|gif)$/i,
                    exclude: /(node_modules)/,
                    use: [
                    'url-loader?limit=10000',
                    'img-loader'
                    ]
                },
            ]
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    // Bundle react & react-dom into separate vendor-react bundle
                    react: {
                        test: /[\\/]node_modules[\\/](react-dom|react)[\\/]/,
                        name: 'vendor-react',
                        chunks: 'all',
                    },
                    materialUi: {
                        test: /[\\/]node_modules[\\/](@material-ui)[\\/]/,
                        name: 'vendor-material-ui',
                        chunks: 'all',
                    },
                }
            },
            usedExports: true,
        },
        externals: {
            "jquery": "jQuery",
            "jquery-mousewheel": "jQuery",
        },
        output: {
            path: '/',
            publicPath:"/webpacked/",
            filename: '[name].js',
        }
    };
};