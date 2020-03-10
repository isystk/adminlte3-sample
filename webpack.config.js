const src = __dirname + "/src";
const dist = __dirname + "/dist/"

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const webpackConfig = {
  context: src,
  entry: {
    index: './index.js',
    layout: './layout.js',
    blog: './blog.js',
    lp: './lp.js',
    form: './form.js',
    form2: './form2.js',
    admin: './admin.js',
    admin2: './admin2.js',
    gallery: './gallery.js',
  },
  output: {
    path: dist,
    filename: 'js/[name].js'
  },
  devServer: {
    contentBase: dist,
    compress: true,
    port: 3000,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      },
      {
          test: /\.(jpe?g|png|gif)$/,
          use: [
              {
                  loader: 'file-loader',
                  options: {
                      name: '[name].[ext]',
                      outputPath : 'images/',
                      publicPath : function(path){
                          return '../images/' + path;
                      },
                      esModule: false
                  }
              }
          ]
      }
    ]
  },
  plugins: [
    // distの中を初期化する
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ favicon: "./assets/favicon.ico" }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css" // Dist
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin(), // JavaScript の minify を行う
      new OptimizeCSSAssetsPlugin() // CSS の minify を行う
    ]
  }
}

Object.keys(webpackConfig.entry).forEach((key) => {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: (key==='index') ?  './assets/index.html' : './assets/html/'+key+'.html', // Source
      filename: (key==='index') ?  './index.html' : './html/'+key+'.html', // Dist
      inject: true,
      chunks: [key], // insert to the root of output folder
    })
  );
})

module.exports = webpackConfig;