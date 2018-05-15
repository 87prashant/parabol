import path from 'path'
import webpack from 'webpack'
import getDotenv from '../src/universal/utils/dotenv'
import npmPackage from '../package.json'
import vendors from '../dll/vendors.json'
import releaseFlagsDefinePlugin from './utils/releaseFlagsDefinePlugin'

// import UnusedFilesWebpackPlugin from "unused-files-webpack-plugin";

/*
 * Configuration invoked from ./src/server/worker.js, et al.
 */

// Import .env and expand variables:
getDotenv()

const root = process.cwd()
const clientInclude = [path.join(root, 'src', 'client'), path.join(root, 'src', 'universal')]

const prefetches = []

const prefetchPlugins = prefetches.map((specifier) => new webpack.PrefetchPlugin(specifier))

export default {
  // devtool: 'source-maps',
  devtool: 'eval',
  context: path.join(root, 'src'),
  entry: {
    app: ['babel-polyfill', 'webpack-hot-middleware/client', 'client/client.js']
  },
  output: {
    // https://github.com/webpack/webpack/issues/1752
    filename: 'app.js',
    // don't hash for performance
    chunkFilename: '[name].chunk.js',
    path: path.join(root, 'build'),
    publicPath: '/static/'
  },
  performance: {
    hints: false
  },
  plugins: [
    ...prefetchPlugins,
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __PRODUCTION__: false,
      __WEBPACK__: true,
      __APP_VERSION__: JSON.stringify(npmPackage.version),
      __GITHUB_CLIENT_ID__: JSON.stringify(process.env.GITHUB_CLIENT_ID),
      __SLACK_CLIENT_ID__: JSON.stringify(process.env.SLACK_CLIENT_ID),
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    releaseFlagsDefinePlugin,
    new webpack.DllReferencePlugin({
      context: root,
      manifest: vendors
    })
    // new UnusedFilesWebpackPlugin()
  ],
  resolve: {
    alias: {
      // necessary when using symlinks that require these guys
      react: path.join(root, 'node_modules', 'react'),
      'react-dom': path.join(root, 'node_modules', 'react-dom')
    },
    extensions: ['.js'],
    modules: [path.join(root, 'src'), 'node_modules']
  },
  module: {
    loaders: [
      {test: /\.flow$/, loader: 'ignore-loader'},
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.(png|jpg|jpeg|gif|svg)(\?\S*)?$/, loader: 'url-loader?limit=1000'},
      {test: /\.(eot|ttf|wav|mp3|woff|woff2)(\?\S*)?$/, loader: 'file-loader'},
      {
        test: /\.js$/,
        loaders: ['babel-loader?cacheDirectory'],
        include: clientInclude
      },
      {test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  }
}
