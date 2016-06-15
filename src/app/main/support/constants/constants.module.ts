namespace app.support.constants {
	'use strict';
	
    var url = window.location.protocol + "//" + (window.location.hostname !== 'localhost' ? window.location.hostname : 'docker');
    var port = "8765";

    angular.module('app.support.constants', []).constant("properties", {
        "url": url,
        "port": port,
        "apiUrl": url + ":" + port,
        "development": true
    });
}
