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

var tsProjectE2E = $.typescript.createProject(path.join(conf.paths.test, 'tsconfig.json'));
var allTypeScriptE2E = path.join(conf.paths.e2e, '**/*.ts');
var libraryTypeScriptE2E = path.join(conf.paths.test, 'typings/main/**/*.d.ts');
var tsOutputPathE2E = conf.paths.e2e;
var tsGenFilesE2E = path.join(conf.paths.e2e, '**/*.js');

/**
 * Install all typings files
 */
gulp.task('install-typings',function(){
    gulp.src('typings.json')
        .pipe($.typings());
});

/**
 * Install e2e typings files
 */
gulp.task('install-typings:e2e',function(){
    gulp.src('typings.json', {cwd: conf.paths.test})
        .pipe($.typings());
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', ['install-typings'], function () {
    return gulp.src(allTypeScript)
    			.pipe($.tslint())
    			.pipe($.tslint.report('prose'));
});

/**
 * Lint e2e custom TypeScript files.
 */
gulp.task('ts-lint:e2e', ['install-typings:e2e'], function() {
    return gulp.src(allTypeScriptE2E)
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
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts:e2e', ['ts-lint:e2e'], function() {
    return gulp.src([allTypeScriptE2E, libraryTypeScriptE2E])
        .pipe($.typescript(tsProjectE2E))
        .pipe($.ngAnnotate())
        .pipe(gulp.dest(tsOutputPathE2E));
});

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean-ts', function (cb) {
	$.del([ tsGenFiles, tsGenMapFiles, tsGenFilesE2E ]).then(function () {
        cb();
    }, function (reason) {
        cb("Failed to delete files " + reason);
    });
});