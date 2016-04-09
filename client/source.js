function requireAll(r) { r.keys().forEach(r); }

requireAll(require.context('./themes', true, /\.css$/));
requireAll(require.context('./src', true, /\.css$/));

//require('./lib/chosen/chosen.jquery.js');
//require('./lib/chosen/chosen.css');

var taskoApp = angular.module('lbxApp', [
	'ui.router', 
	'ui.bootstrap',
	'ngTagsInput',
	'ngStorage',
	'ui.grid']);	
	
//add all js files from the src folder
requireAll(require.context('./src', true, /\.js$/));
requireAll(require.context('./themes', true, /\.js$/));