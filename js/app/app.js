(function() {

    var DEPENDENCIES = [
        'ui.router',
        'ngAnimate',
        'ngTouch',
        'ui.bootstrap',
        'matheland.run',
        'matheland.service',
        'matheland.constant',
        'matheland.controller'
    ];

    angular.module('matheland', DEPENDENCIES);

    for (var i = 0; i < DEPENDENCIES.length; i++) {
        var dependency = DEPENDENCIES[i];
        var packages = dependency.split('.');
        if (packages[0] === 'matheland') {
            angular.module(dependency, []);
        }
    }

})();