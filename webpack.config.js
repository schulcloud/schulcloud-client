const path = require( 'path' );
module.exports = {
    devtool: 'cheap-module-eval-source-map',
    mode: 'development',
    watch: true,
    entry: {
        clipboard: './static/scripts/clipboard/index.js',
        loggedin: './static/scripts/loggedin.js'
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
            // moment needs to be globally exposed in order to work with fullcalendar
            {
                test: require.resolve('moment'),
                loader: 'expose-loader?moment'
            }
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