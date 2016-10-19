(function () {
    'use strict';


    angular
        .module('matheland.run')
        .run(run);

    run.$inject = ['$transitions', 'Session'];

    function run($transitions, Session) {
        var HOME = 'start';

        $transitions.onBefore({}, onBefore);

        function onBefore(trans) {
            var permission = trans.$to().permission;

            if (Session.isDirty()) {
                var session = Session.getSession();
                var state = session.page;
                var params = {
                    difficulty: session.difficulty
                };
                redirectToState(trans, state, params);
            } else {
                redirectToState(trans, HOME, {});
            }
        }

        function redirectToState(trans, state, params) {
            return trans.router.stateService.target(state, params, {location: 'replace'});
        }

    }

})();