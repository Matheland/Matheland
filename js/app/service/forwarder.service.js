(function () {
    'use strict';

    angular
        .module('matheland.service')
        .service('Forwarder', Forwarder);

    Forwarder.$inject = ['Task', 'Difficulty', '$state', 'Session'];

    function Forwarder(Task, Difficulty, $state, Session) {
        var service = this;

        //var PAGES = [Task.FUNCTIONS, Task.VECTORS, Task.TEXT];
        var PAGES = [Task.TEXT];

        service.forward = forward;

        function forward(params) {
            var page = PAGES[0];
            var difficulty = Difficulty.EASY;
            if (params) {
                var task = params.page;
                difficulty = params.difficulty;
                if (task === Task.TEXT) {
                    if (difficulty === Difficulty.HARD) {
                        Session.destroySession();
                        $state.go('start');
                        return;
                    } else {
                        difficulty++;
                    }
                }
                var index = (PAGES.indexOf(task) + 1) % PAGES.length;
                page = PAGES[index];
            }
            var session = {
                page: page,
                difficulty: difficulty
            };
            Session.saveSession(session);
            $state.go(page, session);
        }

    }

})();