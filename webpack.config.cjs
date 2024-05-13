const path = require('node:path');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack')

module.exports = {
	mode: process.env.MODE === 'dev' ? 'development' : 'production',
	entry: {
		app: path.resolve(__dirname, '/src/index.ts')
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'redux-saga-visualizer'),
		library: 'redux-saga-visualizer',
		libraryTarget: 'umd',
		clean: true
	},
	watch: process.env.MODE === 'dev',
	module: {
		rules: [
			{
				test: /\.(tsx?|jsx?)$/,
				exclude: [/node_modules/],
				loader: 'esbuild-loader',
				options: {
					loader: 'tsx',
					target: 'es2015',
					tsconfig: path.resolve(__dirname, 'tsconfig.json'),
				},
			},
		]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		plugins: [
			new TsconfigPathsPlugin({
				configFile: path.resolve(__dirname, 'tsconfig.json')
			})
		]
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		})
	]
};