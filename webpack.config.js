const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");

// Define the root directory containing the HTML files
const rootDirectory = path.resolve(__dirname, "src");

// Function to generate HtmlWebpackPlugin instances for each HTML file
function generateHtmlPlugins(rootDir) {
  const plugins = [];
  // Read the root directory
  const files = fs.readdirSync(rootDir);

  // Filter HTML Pages files
  const htmlPageFiles = files.filter((file) => path.extname(file) === ".html");
  // Loop through HTML files
  htmlPageFiles.forEach((file) => {
    plugins.push(
      new HtmlWebpackPlugin({
        filename: file,
        template: path.join(rootDir, file),
        inject: "body", // Fix: Change `directory` to `rootDir`
      })
    );
  });

  return plugins;
}

const htmlFiles = generateHtmlPlugins(rootDirectory);

module.exports = {
  entry: {
    main: "./src/assets/js/index.js",
  },
  mode: "development",
  devServer: {
    watchFiles: ["src/**/*"],
    hot: true,
    port: "auto",
    // open: ["./index.html"],
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/i,
        include: path.resolve(__dirname, "src"),
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          "sass-loader", // SASS loader will only apply when processing .scss files
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/assets",
          to: "assets",
          globOptions: {
            ignore: [
              "**/js/jquery-3.6.0.min.js",
              "**/js/slick.js",
              "**/js/slick.min.js",
              "**/js/form-validator.min.js",
              "**/js/jquery.ajaxchimp.min.js",
              "**/js/contact-form-script.js",
              "**/js/index.js",
              "**/css/fontawesome.min.css",
              "**/css/swiper-bundle.css",
              "**/fonts/remixicon.glyph.json",
              "**/fonts/remixicon.symbol.svg",
              "**/fonts/remixicon.less",
              "**/fonts/remixicon.scss",
              "**/fonts/remixicon.styl",
            ],
          },
        },
        { from: "src/docs", to: "docs", noErrorOnMissing: true },
        { from: "src/.htaccess", to: ".htaccess", toType: "file" },
        { from: "src/robots.txt", to: "robots.txt", toType: "file" },
        // { from: "src/manifest.json", to: "manifest.json" },
        // { from: "src/service-worker.js", to: "service-worker.js" },
      ],
    }),
    ...htmlFiles,
  ],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
