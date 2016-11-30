(function() {

    angular.module('matheland')
        .config(config);

    config.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider'];

    function config($locationProvider, $stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $locationProvider.html5Mode(false).hashPrefix('');

        $urlMatcherFactoryProvider.defaultSquashPolicy(true);
        $urlMatcherFactoryProvider.strictMode(false);

        $urlRouterProvider.otherwise('/start');

        $stateProvider
            .state('start', {
                url: '/start',
                templateUrl: 'templates/start.html',
                controller: 'StartController',
                controllerAs: 'vm'
            })
            .state('functions', {
                url: '/functions',
                templateUrl: 'templates/functions.html',
                permission: 'functions',
                params: {'page': null, 'difficulty': null},
                controller: 'FunctionsController',
                controllerAs: 'vm'
            })
            .state('vectors', {
                url: '/vectors',
                templateUrl: 'templates/vectors.html',
                permission: 'vectors',
                params: {'page': null, 'difficulty': null},
                controller: 'VectorsController',
                controllerAs: 'vm'
            })
            .state('text', {
                url: '/text',
                templateUrl: 'templates/text.html',
                permission: 'text',
                params: {'page': null, 'difficulty': null},
                controller: 'TextController',
                controllerAs: 'vm'
            });
    }

})();