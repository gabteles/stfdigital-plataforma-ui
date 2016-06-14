'use strict';

var path = require('path');
var conf = require('./../gulp/conf');

var _ = require('lodash');
var wiredep = require('wiredep');

var pathSrcHtml = [
  path.join(conf.paths.src, '/**/*.html')
];

function listFiles() {
  var wiredepOptions = _.extend({}, conf.wiredep, {
    dependencies: true,
    devDependencies: true
  });

  var patterns = wiredep(wiredepOptions).js
      .concat([
        path.join(conf.paths.src, '/app/*.module.js'),
        path.join(conf.paths.src, '/app/*.js'),
        path.join(conf.paths.src, '/app/!(main)/**/*.module.js'),
        path.join(conf.paths.src, '/app/!(main)/**/*.js')
      ])
      .concat(pathSrcHtml);

  var files = patterns.map(function(pattern) {
    return {
      pattern: pattern,
      watched: false
    };
  });

  // Monitora apenas esses arquivos por mudanças.
  var patternsToWatch = [
    path.join(conf.paths.unit, '/build/app/**/*.module.js'),
    path.join(conf.paths.unit, '/build/app/**/*.js'),
    path.join(conf.paths.unit, '/build/test/**/*.spec.js')
  ];

  var filesToWatch = patternsToWatch.map(function(pattern) {
    return {
      pattern: pattern,
      watched: true
    }
  });

  var files = files.concat(filesToWatch);

  var patternsToServeOnly = [
    path.join(conf.paths.src, '/assets/**/*'), // Assets
    path.join(conf.paths.root, '/bower_components/**/*.js'), // Arquivos fontes do bower_components
    path.join(conf.paths.root, '/bower_components/**/*.js.map'), // Mappings dos arquivos do bower_components
    path.join(conf.paths.unit, '/build/**/*.js.map') // Mappings dos testes e app compilado
  ];

  var filesToServeOnly = patternsToServeOnly.map(function(pattern) {
    return {
      pattern: pattern,
      included: false,
      served: true,
      watched: false
    };
  });

  files = files.concat(filesToServeOnly);

  return files;
}

module.exports = function(config) {

  var configuration = {
    files: listFiles(),

    singleRun: true,

    basePath: '..',

    autoWatch: false,

    autoWatchBatchDelay: 2000,

    ngHtml2JsPreprocessor: {
      stripPrefix: conf.paths.src + '/',
      moduleName: 'generatorGulpAngular'
    },

    logLevel: 'WARN',

    frameworks: ['jasmine', 'angular-filesort'],

    angularFilesort: {
      whitelist: [path.join(conf.paths.src, '/**/!(*.html|*.spec|*.mock).js')]
    },

    browsers : ['Chrome'],

    plugins : [
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-angular-filesort',
      //'karma-coverage',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
	    'karma-html-reporter',
	    'karma-mocha-reporter' 
    ],

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    reporters: ['mocha', 'html'],

    htmlReporter : {
		  outputDir : path.join(conf.paths.unit, 'results/html')
    },

    proxies: {
      '/assets/': path.join('/base/', conf.paths.src, '/assets/')
    }
  };

  // This is the default preprocessors configuration for a usage with Karma cli
  // The coverage preprocessor is added in gulp/unit-test.js only for single tests
  // It was not possible to do it there because karma doesn't let us now if we are
  // running a single test or not
  configuration.preprocessors = {};
  pathSrcHtml.forEach(function(path) {
    configuration.preprocessors[path] = ['ng-html2js'];
  });

  config.set(configuration);
};
