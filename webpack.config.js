const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const copyImages = new CopyWebpackPlugin([
  {
    from: 'node_modules/uswds/dist/img',
    to: 'img'
  }
]);
const extractSass = new ExtractTextPlugin({
    filename: 'css/bundle.css'
});
const uglify = new UglifyJsPlugin();
const inProduction = process.env.BUILD_PRODUCTION === 'true';

function getPlugins() {
  let plugins = [
    copyImages,
    extractSass
  ];
  if (inProduction) plugins.push(uglify);
  return plugins;
}

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: inProduction,
                url: false
              }
            },
            {
              loader: 'sass-loader'
            }
          ],
          // use style-loader in development
          fallback: 'style-loader'
        })
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'static')
  },
  plugins: getPlugins(),
  watch: !inProduction,
  watchOptions: {
    ignored: /node_modules/
  }
};
