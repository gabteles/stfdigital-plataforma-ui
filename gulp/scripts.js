'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('scripts-reload', function ()
{
    return buildScripts()
        .pipe(browserSync.stream());
});

gulp.task('scripts', ['bower:prune', 'compile-ts'], function ()
{
    return buildScripts();
});

gulp.task('scripts-ts', ['compile-ts'], function ()
{
    return gulp.start('scripts-reload');
});

function buildScripts()
{
    return gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.size())
};