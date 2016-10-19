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
        service.saveSession = saveSession;
        service.getSession = getSession;
        service.isDirty = isDirty;

        function initialize() {
            var session = loadSession();
            if (session) {
                service.session = session;
            } else {
                createSession();
            }
        }

        function loadSession() {
            var item = storage.getItem(ITEM_NAME);
            if (!item) {
                return false;
            }
            return JSON.parse(item);
        }

        function createSession() {
            saveSession(DEFAULT_SESSION);
        }

        function saveSession(session) {
            var item = JSON.stringify(session);
            storage.setItem(ITEM_NAME, item);
        }

        function getSession() {
            return service.session;
        }

        function isDirty() {
            return service.session != DEFAULT_SESSION;
        }

    }

})();