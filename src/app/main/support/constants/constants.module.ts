namespace app.support.constants {
	'use strict';
	
    var url = window.location.protocol + "//" + (window.location.hostname !== 'localhost' ? window.location.hostname : 'docker');
    var port = 8765;

    /**
     * Propriedades compartilhadas da aplicação
     */
    export interface Properties {
    	url: string;
    	port: number;
    	apiUrl: string;
    	development: boolean;
    } 
    
    angular.module('app.support.constants', []).constant("properties", <Properties>{
        url: url,
        port: port,
        apiUrl: url + ":" + port,
        development: true
    });
}
