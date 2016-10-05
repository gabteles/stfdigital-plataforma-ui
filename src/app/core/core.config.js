(function ()
{
    'use strict';

    angular
        .module('app.core')
        .config(config);

    /** @ngInject */
    function config($ariaProvider, $logProvider, msScrollConfigProvider, $translateProvider, $provide, fuseConfigProvider, $sceDelegateProvider, uiSelectConfig, $mdDateLocaleProvider)
    {
        // ng-aria configuration
        $ariaProvider.config({
            tabindex: false
        });

        // Enable debug logging
        $logProvider.debugEnabled(true);

        // msScroll configuration
        msScrollConfigProvider.config({
            wheelPropagation: true
        });

        // toastr configuration
        toastr.options.timeOut = 3000;
        toastr.options.positionClass = 'toast-top-right';
        toastr.options.preventDuplicates = true;
        toastr.options.progressBar = true;

        // angular-translate configuration
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });
        $translateProvider.preferredLanguage('pt-br');
        $translateProvider.useSanitizeValueStrategy('escape');

        // Fuse theme configurations
        fuseConfigProvider.config({
            'disableCustomScrollbars'        : false,
            'disableCustomScrollbarsOnMobile': true,
            'disableMdInkRippleOnMobile'     : true
        });
        
        $sceDelegateProvider.resourceUrlWhitelist([
			'self',
			'http://docker:8765/**',
			'http://pacaembu:8765/**'
		]);
        
        uiSelectConfig.theme = 'select2';
        
        // TODO: configurar usando o $translate
        $mdDateLocaleProvider.months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        $mdDateLocaleProvider.shortMonths = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        $mdDateLocaleProvider.days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
        $mdDateLocaleProvider.shortDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

        // Example uses moment.js to parse and format dates.
        $mdDateLocaleProvider.parseDate = function(dateString) {
          var m = moment(dateString, "DD/MM/YYYY", true);
          return m.isValid() ? m.toDate() : new Date();
        };

        $mdDateLocaleProvider.formatDate = function(date) {
          var m = moment(date);
          return m.isValid() ? m.format("DD/MM/YYYY") : '';
        };

        // In addition to date display, date components also need localized messages
        // for aria-labels for screen-reader users.
        $mdDateLocaleProvider.msgCalendar = "Calendário";
        $mdDateLocaleProvider.msgOpenCalendar = "Abrir o calendário";
    }
})();