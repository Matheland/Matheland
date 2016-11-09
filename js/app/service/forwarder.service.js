(function () {
    'use strict';

    angular
        .module('matheland.service')
        .service('Forwarder', Forwarder);

    Forwarder.$inject = ['Task', 'Difficulty', '$state', 'Session'];

    function Forwarder(Task, Difficulty, $state, Session) {
        var service = this;

        var PAGES = [Task.FUNCTIONS, Task.VECTORS, Task.TEXT];

        service.forward = forward;

        function forward(params) {
            var task = params.page;
            var difficulty = params.difficulty;
            if (task === Task.TEXT) {
                if (difficulty === Difficulty.HARD) {
                    Session.destroySession();
                } else {
                    difficulty++;
                }
            }
            var index = (PAGES.indexOf(task) + 1) % PAGES.length;
            var page = PAGES[index];
            var session = {
                page: page,
                difficulty: difficulty
            };
            Session.saveSession(session);
            $state.go(page, session);
        }

    }

})();