'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

var createTsProject = function() {
    return $.typescript.createProject('tsconfig.json');
};
var createTsProjectForDefinition = function() {
    return $.typescript.createProject('tsconfig.json', {
    	declaration: true
    });
};
var allTypeScript = path.join(conf.paths.src, '/app/main/**/*.ts');
var libraryTypeScript = 'typings/main/**/*.d.ts';
var tsOutputPath = path.join(conf.paths.src, 'app/main');
var tsGenFiles = path.join(conf.paths.src, 'app/main/**/*.js');
var tsGenMapFiles = path.join(conf.paths.src, 'app/main/**/*.js.map');

var tsProjectE2E = $.typescript.createProject(path.join(conf.paths.e2e, 'tsconfig.json'));
var allTypeScriptE2E = path.join(conf.paths.e2e, 'app/**/*.ts');
var libraryTypeScriptE2E = path.join(conf.paths.e2e, 'typings/main/**/*.d.ts');
var tsOutputPathE2E = path.join(conf.paths.e2e, 'build');
var tsGenFilesE2E = path.join(conf.paths.e2e, '**/*.js');

var createTsProjectUnit = function() {
	return $.typescript.createProject(path.join(conf.paths.unit, 'tsconfig.json'));
};
var allTypeScriptUnit = path.join(conf.paths.unit, 'app/main/**/*.ts');
var libraryTypeScriptUnit = path.join(conf.paths.unit, 'typings/main/**/*.d.ts');
var tsOutputPathUnit = path.join(conf.paths.unit, 'build/test');
var tsGenFilesUnit = path.join(conf.paths.unit, '**/*.js');
var tsOutputPathUnitForApp = path.join(conf.paths.unit, 'build/app');

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
    gulp.src('typings.json', {cwd: conf.paths.e2e})
        .pipe($.typings());
});

/**
 * Install all unit typings files
 */
gulp.task('install-typings:unit', ['generate-definitions'], function() {
    return gulp.src('typings.json', {cwd : conf.paths.unit})
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
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint:unit', ['install-typings:unit'], function() {
    return gulp.src(allTypeScriptUnit)
    			.pipe($.tslint())
    			.pipe($.tslint.report('prose'));
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts', ['ts-lint'], function () {
    return gulp.src([allTypeScript, libraryTypeScript])
        .pipe($.sourcemaps.init())
        .pipe($.typescript(createTsProject()))
        .pipe($.ngAnnotate())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(tsOutputPath));
});

gulp.task('compile-ts:for-tdd', [], function () {
    return gulp.src([allTypeScript, libraryTypeScript])
        .pipe($.sourcemaps.init())
        .pipe($.typescript(createTsProject()))
        .pipe($.ngAnnotate())
        .pipe($.sourcemaps.write('.'))
        .pipe($.destClean(tsOutputPathUnitForApp))
        .pipe(gulp.dest(tsOutputPathUnitForApp));
});

gulp.task('generate-definitions', function() {
	return gulp.src([allTypeScript, libraryTypeScript])
    	.pipe($.typescript(createTsProjectForDefinition()))
    	.dts
        .pipe($.destClean('definitions'))
        .pipe(gulp.dest('definitions'));
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
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts:unit', ['ts-lint:unit'], function() {
    return gulp.src([allTypeScriptUnit, libraryTypeScriptUnit])
        .pipe($.sourcemaps.init())
        .pipe($.typescript(createTsProjectUnit()))
        .pipe($.ngAnnotate())
        .pipe($.sourcemaps.write('.'))
        .pipe($.destClean(tsOutputPathUnit))
        .pipe(gulp.dest(tsOutputPathUnit));
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