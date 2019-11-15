var path = require('path')
var webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const NODE_ENV = process.env.NODE_ENV
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  entry: NODE_ENV == 'development' ? './src/main.js' : './index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
      {
        test: /\.(js|vue)$/,
        loader: "eslint-loader",
        enforce: "pre",
        //指定检查的目录
        include: [path.resolve(__dirname, 'src')],
        //eslint检查报告的格式规范
        options: {
          formatter: require("eslint-friendly-formatter")
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
      　　test: /\.(svg|ttf|eot|woff|woff2)$/, 
      　　loader: 'url-loader',
      　　options:{ 
  　　　　   name:'fonts/[name].[ext]'
            // limit: 9999999 // 这个可以让字体图标都打包进js里
      　　} 
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: false,
    overlay: true
  },
  performance: {
    hints: false
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  optimization: {
    minimize: true, 
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            // warnings: false,
            // drop_debugger: true,
            // drop_console: true
          },
          sourceMap: false
        }
      })
    ]
  }
}

if (process.env.NODE_ENV === 'production') {
  // module.exports.devtool = '#source-map' // 生产环境就不要调试代码了。
  module.exports.mode = 'production'
  // module.exports.plugins = (module.exports.plugins || []).concat([
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: '"production"'
    //   }
    // }),
    // new MiniCssExtractPlugin({filename:'mian.css'}) // 这个是把css打包到一个文件，由于css不多， 就直接把css打包到 buil.js 里面了。
  // ])
} else if (process.env.NODE_ENV === 'analyse') {
  module.exports.mode = 'development'
  module.exports.devtool = '#eval-source-map',
  module.exports.plugins = (module.exports.plugins || []).concat([
    new BundleAnalyzerPlugin()
  ])
} else {
  module.exports.devtool = 'eval-source-map'
  module.exports.mode = 'development'
}
