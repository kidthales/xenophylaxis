const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin } = require('webpack');
const VersionFile = require('webpack-version-file');

const pkg = require('./package.json');

/**
 * @param {Record<string, any>} env
 * @param {Record<string, any>} args
 * @returns {Promise<import('webpack').Configuration>}
 */
module.exports = async (env, args) => {
  const mode = args.mode || 'production';
  const isProd = mode === 'production';
  const isDevServer = env.WEBPACK_SERVE || false;
  const isDebug = process.env.DEBUG === 'true' || false;

  let versionBuildMeta = isProd ? '' : 'dev';

  if (isDebug) {
    versionBuildMeta += `${versionBuildMeta ? '.' : ''}debug`;
  }

  const version = pkg.version + (versionBuildMeta ? `+${versionBuildMeta}` : '');
  const versionFilename = 'version.txt';

  const distPath = resolve(__dirname, 'dist');

  return {
    devtool: isProd ? false : 'eval-source-map',
    entry: resolve(__dirname, 'src', 'main.ts'),
    output: {
      path: distPath,
      filename: `bundle.${isProd ? 'min' : 'dev'}${isDebug ? '.debug' : ''}.js`,
      chunkFilename: 'chunks/[id].[contenthash].js',
      assetModuleFilename: 'asset-modules/[hash][ext][query]'
    },
    optimization: isProd
      ? {
          minimizer: [
            new TerserPlugin({
              terserOptions: {}
            })
          ]
          /*splitChunks: {
            chunks: 'all'
          }*/
        }
      : undefined,
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: {
        '@phaser': resolve(__dirname, 'libs', 'phaser.js'),
        '@styles': resolve(__dirname, 'design', 'styles', 'index.ts')
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: 'ts-loader'
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProd
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProd
              }
            }
          ]
        },
        {
          test: /\.(gif|png|jpe?g|svg|xml|glsl|woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource'
        },
        {
          test: [/\.vert$/, /\.frag$/],
          type: 'asset/source'
        }
      ]
    },
    plugins: [
      !isDevServer
        ? new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', `!${versionFilename}`] })
        : undefined,
      isProd
        ? new MiniCssExtractPlugin({
            filename: `bundle.${isProd ? 'min' : 'dev'}${isDebug ? '.debug' : ''}.css`,
            chunkFilename: `chunks/[id].[contenthash].css`
          })
        : undefined,
      new DefinePlugin({
        DEBUG: JSON.stringify(isDebug),
        VERSION: JSON.stringify(version),
        'typeof DEBUG': JSON.stringify(isDebug),
        'typeof CANVAS_RENDERER': JSON.stringify(true),
        'typeof WEBGL_RENDERER': JSON.stringify(true),
        'typeof WEBGL_DEBUG': JSON.stringify(isDebug),
        'typeof EXPERIMENTAL': JSON.stringify(true),
        'typeof PLUGIN_3D': JSON.stringify(false),
        'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
        'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
        'typeof FEATURE_SOUND': JSON.stringify(true)
      }),
      new HtmlWebpackPlugin({
        template: resolve(__dirname, 'src', 'templates', 'index.html'),
        meta: {
          viewport: 'width=device-width, initial-scale=1.0'
        }
      }),
      !isDevServer
        ? new CopyPlugin({
            patterns: [{ from: 'src/assets', to: 'assets' }]
          })
        : undefined,
      !isDevServer
        ? new VersionFile({
            output: resolve(distPath, versionFilename),
            templateString: '<%= version %>',
            data: { version }
          })
        : undefined
    ].filter(Boolean),
    devServer: {
      hot: false,
      static: {
        directory: resolve(__dirname, 'src')
      }
    }
  };
};
