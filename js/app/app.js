(function() {

    var DEPENDENCIES = [
        'ui.router',
        'matheland.service',
        'matheland.controller',
        'matheland.run',
        'matheland.constant'
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