'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var argv = require('yargs').argv;

var karma = require('karma');
var runSequence = require('run-sequence');
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

var $ = require('gulp-load-plugins')();

var pathSrcJs = [
    path.join(conf.paths.dist, '**/*.js')
];

function runTests(singleRun, done)
{
    var preprocessors = {};
    if (singleRun) {
        pathSrcJs.forEach(function (path)
        {
            preprocessors[path] = ['coverage'];
        });
    }

    var localConfig = {
        configFile   : path.resolve(path.join(conf.paths.test, '/karma.conf.js')),
        singleRun    : singleRun,
        autoWatch    : !singleRun,
        preprocessors: preprocessors
    };

    if (argv.browsers) {
        localConfig.browsers = argv.browsers.split(',');
    }

    var server = new karma.Server(localConfig, function (failCount)
    {
        done(failCount ? new Error("Failed " + failCount + " tests.") : null);
    })
    server.start();
}

gulp.task('test:unit', function (done)
{
    runSequence('clean-typings:unit', ['compile-ts:for-tdd', 'compile-ts:unit', 'scripts'], function() {
        runTests(true, done);
    });
});

gulp.task('tdd', function (done)
{
    runSequence('clean-typings:unit', ['compile-ts:unit', 'watch-sources:for-tdd', 'watch-unit'], function() {
        runTests(false, done);
    });
});

gulp.task('watch-unit', ['compile-ts:unit'], function() {
    gulp.watch(path.join(conf.paths.unit, 'app/main/**/*.ts'), ['compile-ts:unit']);
});

gulp.task('watch-sources:for-tdd', ['compile-ts:for-tdd'], function ()
{
    gulp.watch([path.join(conf.paths.src, '/app/main/**/*.ts')], ['compile-ts:for-tdd']);
});

gulp.task('remap-istanbul', function () {
    return gulp.src(path.join(conf.paths.unit, 'coverage/js/coverage.json'))
        .pipe(remapIstanbul({
            reports: {
                'json': path.join(conf.paths.unit, 'coverage/ts/coverage.json'),
                'html': path.join(conf.paths.unit, 'coverage/ts/html'),
                'lcovonly': path.join(conf.paths.unit, 'coverage/ts/lcov.info')
            }
        }));
});

gulp.task('publish-unit-coverage', function() {
    return gulp.src(path.join(conf.paths.unit, 'coverage/ts/lcov.info'))
        .pipe($.coveralls());
});