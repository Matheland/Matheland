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
                templateUrl: 'templates/start.html'
            })
            .state('functions', {
                url: '/functions',
                templateUrl: 'templates/functions.html'
            })
            .state('vectors', {
                url: '/vectors',
                templateUrl: 'templates/vectors.html'
            })
            .state('text', {
                url: '/text',
                templateUrl: 'templates/text.html'
            });
    }

})();