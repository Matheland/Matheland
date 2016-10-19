(function (createjs) {
    'use strict';

    angular
        .module('matheland.service')
        .service('Ticker', Ticker);

    function Ticker() {
        var service = this;

        var ticker = createjs.Ticker;

        service.start = start;
        service.stop = stop;

        function start(stage) {
            ticker.framerate = 60;
            ticker.addEventListener('tick', stage.update);
        }

        function stop() {
            ticker.reset();
        }

    }

})(createjs);