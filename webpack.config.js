const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlConfig = require(path.join(__dirname, 'html.config'));

const deploy = `/${'deploy'}`;


const plugins = [new HtmlWebpackPlugin(HtmlConfig), new MiniCssExtractPlugin(), new CopyPlugin([
  { from: __dirname + '/static', to: __dirname + deploy + '' }
])];

const build_mode = process.env.WEBPACK_SERVE ? 'development' : 'production';

module.exports = {
  mode: build_mode,
  stats: 'errors-only',
  output: {
    path: __dirname + deploy
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.hxml$/,
        loader: 'haxe-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: deploy + '/assets/image/'
            }
          }
        ]
      },
      {
        test: /\.(mp3|ogg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: deploy + '/assets/audio/'
            }
          }
        ]
      },
      {
        test: /\.(mp4)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: deploy + '/assets/video/'
            }
          }
        ]
      }
    ]
  }
};
