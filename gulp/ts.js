'use strict';

var path = require('path');
var gulp = require('gulp');
var merge = require('merge2');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});


var createTsProject = function(dev) {
    return $.typescript.createProject('tsconfig.json', {
        declaration: dev ? true : false,
        noExternalResolve: dev? true : false,
    });
};

var createTsProjectForDefinition = function() {
    return $.typescript.createProject('tsconfig.json', {
    	declaration: true
    });
};
var allTypeScript = path.join(conf.paths.src, '/app/main/**/*.ts');
var libraryTypeScript = 'typings/main/**/*.d.ts';
var tsOutputPath = path.join(conf.paths.src, 'build/main');
var danglingJsOutputPath = path.join(conf.paths.src, 'app/main');
var tsGenFiles = path.join(conf.paths.src, 'app/main/**/*.js');
var tsGenMapFiles = path.join(conf.paths.src, 'app/main/**/*.js.map');

var tsProjectDev = createTsProject(true);
var tsProjectE2E = $.typescript.createProject(path.join(conf.paths.e2e, 'tsconfig.json'));
var allTypeScriptE2E = path.join(conf.paths.e2e, 'app/**/*.ts');
var libraryTypeScriptE2E = path.join(conf.paths.e2e, 'typings/main/**/*.d.ts');
var tsOutputPathE2E = path.join(conf.paths.e2e, 'build');
var tsGenFilesE2E = path.join(conf.paths.e2e, '**/*.js');
var tsTypingsOutputPathE2E = path.join(conf.paths.e2e, 'typings');
var sharedOutputPathE2E = path.join(conf.paths.e2e, 'app/shared');

var createTsProjectUnit = function() {
	return $.typescript.createProject(path.join(conf.paths.unit, 'tsconfig.json'));
};
var allTypeScriptUnit = path.join(conf.paths.unit, 'app/main/**/*.ts');
var libraryTypeScriptUnit = path.join(conf.paths.unit, 'typings/main/**/*.d.ts');
var tsOutputPathUnit = path.join(conf.paths.unit, 'build/test');
var tsGenFilesUnit = path.join(conf.paths.unit, '**/*.js');
var tsOutputPathUnitForApp = path.join(conf.paths.unit, 'build/app');
var tsTypingsOutputPath = path.join(conf.paths.unit, 'typings');

/**
 * Install all typings files
 */
gulp.task('install-typings',function(){
    return gulp.src('typings.json')
        .pipe($.typings());
});

/**
 * Install e2e typings files
 */
gulp.task('install-typings:e2e',function(){
    return gulp.src('typings.json', {cwd: conf.paths.e2e})
        .pipe($.typings());
});

gulp.task('clean-typings:e2e', function() {
    return $.del(tsTypingsOutputPathE2E);
});

/**
 * Install the shared e2e files
 */
gulp.task('install-shared:e2e', function() {
    return gulp.src(path.join(conf.paths.root, 'shared/e2e/**'))
        .pipe($.destClean(sharedOutputPathE2E))
        .pipe(gulp.dest(sharedOutputPathE2E));
});

/**
 * Install all unit typings files
 */
gulp.task('install-typings:unit', ['generate-definitions'], function() {
    return gulp.src('typings.json', {cwd : conf.paths.unit})
        .pipe($.typings());
});

gulp.task('clean-typings:unit', function() {
    return $.del(tsTypingsOutputPath);
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
gulp.task('ts-lint:e2e', ['install-typings:e2e', 'install-shared:e2e'], function() {
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

gulp.task('clean-dangling-js', function() {
    $.del([path.join(danglingJsOutputPath, '**/*.js'), path.join(danglingJsOutputPath, '**/*.js.map')]);
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
var compileTS = function(){
    var resultTs = gulp.src([allTypeScript, libraryTypeScript])
        .pipe($.sourcemaps.init())
        .pipe($.typescript(tsProjectDev));
        
    var resultSM = resultTs.js
        .pipe($.ngAnnotate({ rename: conf.annotateRename }))
        .pipe($.sourcemaps.write('.'));

    return merge([
            resultSM.pipe($.destClean(tsOutputPath))
                 .pipe(gulp.dest(tsOutputPath)),
            resultTs.dts.pipe($.destClean('definitions'))
                 .pipe(gulp.dest('definitions'))
    ]);
}
gulp.task('compile-ts', ['ts-lint'], function () {
    return compileTS();
});
gulp.task('compile-dev-ts', function(){
    return compileTS();
});

gulp.task('compile-ts:for-tdd', [], function () {
    return gulp.src([allTypeScript, libraryTypeScript])
        .pipe($.sourcemaps.init())
        .pipe($.typescript(createTsProject()))
        .pipe($.ngAnnotate({ rename: conf.annotateRename }))
        .pipe($.sourcemaps.write('.', {sourceRoot: conf.paths.src + '/app/main'}))
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
        .pipe($.ngAnnotate({ rename: conf.annotateRename }))
        .pipe(gulp.dest(tsOutputPathE2E));
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts:unit', ['ts-lint:unit'], function() {
    return gulp.src([allTypeScriptUnit, libraryTypeScriptUnit])
        .pipe($.sourcemaps.init())
        .pipe($.typescript(createTsProjectUnit()))
        .pipe($.ngAnnotate({ rename: conf.annotateRename }))
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
