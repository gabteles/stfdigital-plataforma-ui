'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

var tsProject = $.typescript.createProject('tsconfig.json');
var allTypeScript = path.join(conf.paths.src, '/app/main/**/*.ts');
var libraryTypeScript = 'typings/main/**/*.d.ts';
var tsOutputPath = path.join(conf.paths.src, '/app/main');
var tsGenFiles = path.join(conf.paths.src, '/app/main/**/*.js');
var tsGenMapFiles = path.join(conf.paths.src, '/app/main/**/*.js.map');

/**
 * Install all typings files
 */
gulp.task('install-typings',function(){
    gulp.src('typings.json')
        .pipe($.typings());
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', function () {
    return gulp.src(allTypeScript)
    			.pipe($.tslint())
    			.pipe($.tslint.report('prose'));
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts', ['ts-lint'], function () {
    return gulp.src([allTypeScript, libraryTypeScript])
        .pipe($.sourcemaps.init())
        .pipe($.typescript(tsProject))
        .pipe($.ngAnnotate())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(tsOutputPath));
});

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean-ts', function (cb) {
	$.del([ tsGenFiles, tsGenMapFiles ]).then(function () {
        cb();
    }, function (reason) {
        cb("Failed to delete files " + reason);
    });
});