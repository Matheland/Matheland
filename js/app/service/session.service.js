(function () {
    'use strict';

    angular
        .module('matheland.service')
        .service('Session', Session);

    Session.$inject = ['$window'];

    function Session($window) {
        var service = this;

        service.session = null;

        var ITEM_NAME = 'matheland';
        var DEFAULT_SESSION = {
            page: null,
            difficulty: null
        };

        var storage = $window.localStorage;

        service.initialize = initialize;
        service.destroySession = destroySession;
        service.saveSession = saveSession;
        service.update = update;
        service.getSession = getSession;
        service.isDirty = isDirty;

        function initialize() {
            var session = loadSession();
            if (session) {
                service.session = session;
            } else {
                destroySession();
            }
        }

        function loadSession() {
            var item = storage.getItem(ITEM_NAME);
            if (!item) {
                return false;
            }
            return JSON.parse(item);
        }

        function destroySession() {
            service.session = DEFAULT_SESSION;
            saveSession();
        }

        function saveSession() {
            var item = JSON.stringify(service.session);
            storage.setItem(ITEM_NAME, item);
        }

        function update(session) {
            service.session = session;
        }

        function getSession() {
            return service.session;
        }

        function isDirty() {
            return service.session != DEFAULT_SESSION;
        }

    }

})();