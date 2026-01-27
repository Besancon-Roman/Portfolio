const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        { loader: 'css-loader', options: { importLoaders: 1 }},
        'postcss-loader',
      ],
    }]
  },
  devtool : 'eval-source-map',
  devServer: {
    historyApiFallback: true,
    compress: true,
    hot: true,
    liveReload: false,
    port: 3000,
    open: false,
  }
});