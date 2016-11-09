(function() {

    angular.module('matheland')
        .config(config);

    config.$inject = ['Session'];

    function config(Session) {
        Session.initialize();
    }

})();