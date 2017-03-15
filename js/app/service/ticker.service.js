(function (createjs) {
    'use strict';

    angular
        .module('matheland.service')
        .service('Ticker', Ticker);

    function Ticker() {
        var service = this;

        var ticker = createjs.Ticker;
        var lastTick;

        service.start = start;
        service.stop = stop;

        function start(stage, init) {
            var onTick = function() {
                stage.update();
            };
            if (init) {
                onTick = function() {
                    init();
                    stage.update();
                }
            }
            ticker.framerate = 60;
            ticker.on('tick', onTick);
            lastTick = onTick;
        }

        function stop() {
            ticker._inited = false;
            ticker.off('tick', lastTick);
        }

    }

})(createjs);