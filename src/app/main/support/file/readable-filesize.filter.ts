namespace app.support{
    'use strict';
    
    export class ReadableFilesize {
        constructor(){

        }

        public filter(bytes, precision): string {
            var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
                return '-';
            }

            if (typeof precision === 'undefined') {
                precision = 1;
            }

            var number = Math.floor(Math.log(bytes) / Math.log(1024));

            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
        }

        public static factory(){
            return () => {
                'ngInject';
                return new ReadableFilesize().filter;
            }
        }
    }

    angular
        .module('app.support')
        .filter('readableFilesize', ReadableFilesize.factory());
}