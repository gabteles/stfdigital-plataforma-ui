'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var karma = require('karma');

var pathSrcHtml = [
    path.join(conf.paths.src, '/**/*.html')
];

var pathSrcJs = [
    path.join(conf.paths.src, '/**/!(*.spec).js')
];

function runTests(singleRun, done)
{
    var reporters = ['progress'];
    var preprocessors = {};
    /*
    pathSrcHtml.forEach(function (path)
    {
        preprocessors[path] = ['ng-html2js'];
    });

    if ( singleRun )
    {
        pathSrcJs.forEach(function (path)
        {
            preprocessors[path] = ['coverage'];
        });
        reporters.push('coverage')
    }
    */
    var localConfig = {
        configFile   : path.resolve(path.join(conf.paths.test, 'karma.conf.js')),
        singleRun    : singleRun,
        autoWatch    : !singleRun
        //reporters    : reporters,
        //preprocessors: preprocessors
    };

    var server = new karma.Server(localConfig, function (failCount)
    {
        done(failCount ? new Error("Failed " + failCount + " tests.") : null);
    })
    server.start();
}

gulp.task('test:unit', ['compile-ts:for-tdd', 'compile-ts:unit', 'scripts'], function (done)
{
    runTests(true, done);
});

gulp.task('tdd', ['compile-ts:unit', 'watch-sources:for-tdd', 'watch-unit'], function (done)
{
    runTests(false, done);
});

gulp.task('watch-unit', ['compile-ts:unit'], function() {
    gulp.watch(path.join(conf.paths.unit, 'app/main/**/*.ts'), ['compile-ts:unit']);
});

gulp.task('watch-sources:for-tdd', ['compile-ts:for-tdd'], function ()
{
    gulp.watch([path.join(conf.paths.src, '/app/main/**/*.ts')], ['compile-ts:for-tdd']);
});