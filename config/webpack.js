// config/webpack.js 
 
var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, '../.tmp/public');
var APP_DIR = path.resolve(__dirname, '../assets');

var PROD = JSON.parse(process.env.PROD_ENV || '0');

var plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
];

if(PROD){
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
}

module.exports.webpack = {
    options: {
        devtool: 'eval',
        entry: APP_DIR + '/js/app.jsx',
        output: {
            path: BUILD_DIR,
            filename: 'bundle.js'
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),

        ],
        module: {
            loaders: [{
                test: /\.css$/, loader: 'style!css' 
            },{
                test : /\.jsx?/,
                include : APP_DIR,
                loader : 'babel'
            }]
        },
        resolve: {
            modulesDirectories: ['../node_modules'],
        }
    },
 
    // docs: https://webpack.github.io/docs/node.js-api.html#compiler 
    watchOptions: {
        aggregateTimeout: 300
    }
};
