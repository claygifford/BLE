var webpack = require('webpack');
//var { ProvidePlugin } from 'webpack';

module.exports = {
	entry: {
		//app: './source.js',
		app: './client/source.js'
	},	
	devtool: 'sourcemap',
	output: {
		filename: 'app.js',
		publicPath: './build/'
	},
	module: {
		loaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader', query: { presets: ['es2015'] } },
			{ test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader', query: { presets: ['es2015'] } },
			{ test: /\.html$/, loader: 'raw' },
			{ test: /\.styl$/, loader: 'style!css!stylus' },
			{ test: /\.css$/, loader: 'style!css' },
			{ test: /\.less$/, loader: "style!css!less" },
			{ test: /\.coffee$/, loader: "coffee-loader" },
			{ test: /\.gif/, loader: 'url-loader?limit=10000&mimetype=image/gif' },
			{ test: /\.jpg/, loader: 'url-loader?limit=10000&mimetype=image/jpg' },
			{ test: /\.png/, loader: 'url-loader?limit=10000&mimetype=image/png' },
			{ test: /\.svg/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
			{ test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?prefix=font/&limit=5000' },
			{ test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?prefix=font/&limit=5000' },
			{ test: /\.eot(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?prefix=font/' },
			{ test: /\.ttf(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?prefix=font/' },
			{ test: /jquery\.js$/, loader: 'expose?$' },
			{ test: /jquery\.js$/, loader: 'expose?jQuery' },			
			{ test: /\.node$/, loader: 'node-loader' }
		]
	},
	resolve: {
		extensions: ["", ".webpack.js", ".web.js", ".js", ".node"]
    },	
	debug: true
};