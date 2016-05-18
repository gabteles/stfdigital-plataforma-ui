(function ()
{
    'use strict';

    var url = window.location.protocol + "//" + (window.location.hostname !== 'localhost' ? window.location.hostname : 'docker');
    var port = "8765";

    angular.module('app.constants', []).constant("properties", {
        "url": url,
        "port": port,
        "apiUrl": url + ":" + port,
        "development": true
    });
    
})();
