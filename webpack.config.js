const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

const WebpackMessages = require('webpack-messages')

console.clear()

module.exports = (env, argv) => ({
	// This is necessary because Figma's 'eval' works differently than normal eval
	devtool: argv.mode === 'production' ? false : 'inline-source-map',

	entry: {
		ui: './src/ui.ts',
		main: './src/main.ts',
	},

	resolveLoader: {
		modules: [path.join(__dirname, 'node_modules')]
	},

	// stats: {
	// 	logging: 'info',
		
	// 	modules: false,

	// 	// assets: false,
	// 	builtAt: false,
	// 	timings: false,
	// 	version: false,
	// 	entrypoints: false,
	// 	hash: false
	// },

	stats: false,

	module: {
		rules: [
			// Converts Vue code to JavaScript
			{ test: /\.vue$/, loader: 'vue-loader', exclude: /node_modules/ },

			// Converts TypeScript code to JavaScript
			{ test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },

			// Enables including CSS by doing "import './file.css'" in your TypeScript code
			{ test: /\.css$/, loader: [{ loader: 'style-loader' }, { loader: 'css-loader' }] },

			// Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
			{ test: /\.(png|jpg|gif|webp|svg|woff2)$/, loader: [{ loader: 'url-loader' }] },

			{ test: /\.scss$/, use: [ 'vue-style-loader', 'css-loader', 'sass-loader' ] }
		],
	},

	resolve: {
		// Webpack tries these extensions for you if you omit the extension like "import './file'"
		extensions: ['.tsx', '.ts', '.jsx', '.js', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		}
	},

	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'build'),
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: './src/ui.html',
			filename: 'ui.html',
			inlineSource: '.(js)$',
			chunks: ['ui'],
		}),
		new HtmlWebpackInlineSourcePlugin(),
		new VueLoaderPlugin(),
		new WebpackMessages()
	],

	node: {
		// prevent webpack from injecting useless setImmediate polyfill because Vue
		// source contains it (although only uses it if it's native).
		setImmediate: false,
		// prevent webpack from injecting mocks to Node native modules
		// that does not make sense for the client
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty'
	}
});


