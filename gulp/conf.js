/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
    root : '.',
    src : 'src',
    dist: 'dist',
    tmp : '.tmp',
    test: 'test',
    e2e : 'test/e2e',
    unit: 'test/unit'
};

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
    directory: 'bower_components'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function (title)
{
    'use strict';

    return function (err)
    {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};

exports.annotateRename = [
	{ from: 'cryptoService', to: 'app.certification.CryptoService'},
	{ from: 'onlyofficeService', to: 'app.documentos.OnlyofficeService' },
	{ from: 'meusPaineisService', to: 'app.gestao.meus-paineis.MeusPaineisService' },
	{ from: 'pesquisaAvancadaService', to: 'app.pesquisa-avancada.PesquisaAvancadaService' },	
	{ from: 'dashboardLayoutManager', to: 'app.support.dashboards.DashboardLayoutManager' },
	{ from: 'suggestionService', to: 'app.support.suggestion.SuggestionService' }
];