(function() {

    angular.module('matheland')
        .run(config);

    config.$inject = ['Session'];

    function config(Session) {
        //Session.initialize();
    }

})();