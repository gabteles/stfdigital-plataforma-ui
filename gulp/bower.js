'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('bower:install', function() {
	return $.bower();
});

gulp.task('bower:prune', ['bower:install'], function() {
	return $.bower({ cmd: 'prune'});
});
