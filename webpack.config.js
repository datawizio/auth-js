const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CleanTerminalPlugin = require("clean-terminal-webpack-plugin");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";
const isStats = process.env.NODE_ENV === "statistic";

const getPath = dir => path.resolve(__dirname, dir);

const paths = {
  index: getPath("src/index.ts"),
  src: getPath("src"),
  appHtml: getPath("templates"),
  build: getPath("lib"),
  example: getPath("example/lib"),
  appNodeModules: getPath("node_modules"),
  appTsConfig: getPath("tsconfig.json")
};

module.exports = {
  entry: paths.index,
  devtool: isDev && "source-map", // Enable sourcemaps for debugging webpack"s output.

  output: {
    path: isDev ? paths.example : paths.build,
    filename: "index.js",
    libraryTarget: "umd",
    library: "DatawizAuth"
  },

  stats: isDev ? "errors-warnings" : "normal",

  performance: {
    hints: false,
    maxAssetSize: Infinity,
    maxEntrypointSize: Infinity
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"], // Resolvable extensions.
    modules: [paths.appNodeModules]
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      },

      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader" // All output ".js" files will have any sourcemaps re-processed by "source-map-loader".
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    isDev && new CleanTerminalPlugin(),
    new ForkTsCheckerWebpackPlugin({
      eslint: true
    })
  ].filter(i => i)
};
