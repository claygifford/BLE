// import gulp from 'gulp';
// import webpack from 'webpack-stream';
// import path from 'path';
// import sync from 'run-sequence';
// import browserSync from 'browser-sync';
// import fs from 'fs';
// import del from 'del';

const gulp = require('gulp');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const path = require('path');
const sync = require('run-sequence');
const browserSync = require('browser-sync');
const fs = require('fs');
const del = require('del');
const modRewrite  = require('connect-modrewrite');

var clientServer = browserSync.create();
var reloadClient = function () { return clientServer.reload() };

var root = 'client';
var output = 'build/client';

// map of all our paths
var paths = {
	clientJs: [ path.join(root, '**/*.js') ],
	css: [ path.join(root, 'themes/**/*.css'), path.join(root, 'src/**/*.css')],
	img: path.join(root, 'img/**/*.*'),
	ico: path.join(root, '**/*.ico'),
	plugins: path.join(root, 'plugins/**/*.*'),
	html: path.join(root, '**/*.html'),
	json: path.join(root, '**/*.json'),
	clientEntry: path.join(root, 'main.js'),
	output: output,
};
	
gulp.task('clean', () => {
  del(['.tmp', 'build/*'], {dot: true}, () => {
  });
});

gulp.task('files', () => {
  return gulp.src([paths.html, paths.json])  
	.pipe(gulp.dest(paths.output));
});

gulp.task('plugins', () => {
  return gulp.src(paths.plugins)
    .pipe(gulp.dest(paths.output + "/plugins"));
});

gulp.task('ico', () => {
  return gulp.src(paths.ico)
    .pipe(gulp.dest(paths.output));
});

gulp.task('img', () => {
  return gulp.src(paths.img)
    .pipe(gulp.dest(paths.output + "/img"));
});

gulp.task('client-files', done => {
	sync('files', 'img', 'ico', 'plugins', done);
});

gulp.task('webpack-source', () => {
	var config = require('./client/webpack.source.config');
	config.entry = { app: './client/source.js' };
	
	return gulp.src(paths.clientEntry)
		.pipe(webpack(config))
		.pipe(gulp.dest(paths.output));
});

gulp.task('webpack-modules', () => {
	var config = require('./client/webpack.modules.config');
	config.entry = { app: './client/modules.js' };
  
	return webpack(config)
		.pipe(gulp.dest(path.join(paths.output)));
});

gulp.task('webpack', done => {
	sync('webpack-source', 'webpack-modules', done);
});

gulp.task('serve-client', () => {
	clientServer.init({
		port: process.env.PORT || 3000,
		open: true,
		server: {
			baseDir: output,
			index: 'default.html',
			middleware: [
                modRewrite([
                    '!\\.\\w+$ /default.html [L]'
                ])
            ]
		},
		//middleware: function (req, res, next) {
		//	res.setHeader('Access-Control-Allow-Origin', '*');
		//	next();
		//}		
	});
});

gulp.task('watch-client', () => {
	var allPaths = [].concat(
		[paths.css],
		[paths.json],
		[paths.clientJs],
		[paths.html],
		[paths.plugins]
	);
		
	gulp.watch(allPaths, ['client-files', 'webpack', reloadClient]);
});

gulp.task('watch-client-source', () => {
	var allPaths = [].concat(
		[paths.css],
		[paths.json],
		[paths.clientJs],
		[paths.html],
		[paths.plugins]
	);
		
	gulp.watch(allPaths, ['client-files', 'webpack-source', reloadClient]);
});

// gulp.task('client-deploy', done => {
	// sync('client-files', 'config-client-deploy', 'webpack-client', done);
// });

gulp.task('client-source', done => {
	sync('client-files', 'webpack', 'serve-client', 'watch-client-source', done);
});

gulp.task('client', done => {
	sync('client-files', 'webpack', 'serve-client', 'watch-client', done);
});

// gulp.task('deploy', done => {
	// sync('clean', 'client-deploy', 'server-deploy', done);
// });

gulp.task('default', done => {
	sync('clean', 'client', done);
});