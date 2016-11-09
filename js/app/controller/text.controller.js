(function (easel, tween) {
    'use strict';

    angular
        .module('matheland.controller')
        .service('TextController', TextController);

    TextController.$inject = ['Difficulty', '$stateParams', 'Forwarder', 'Ticker'];

    function TextController(Difficulty, $stateParams, Forwarder, Ticker) {
        var vm = this;

        vm.submit = submit;

        var Importance = {
            POSITIVE: '*',
            NEGATIVE: '_'
        };

        var task = {
            text: '*HIER* ist ein wichtiger Text. _HIER_ allerdings nicht.'
        };

        var game = {
            markedRanges: []
        };

        init();

        function init() {
            game.task = task;
            processText(task.text);
        }

        function processText(text) {
            var displayText = "";
            var offset = 0;
            var start = -1;
            var positiveRanges = [];
            var negativeRanges = [];

            for (var i = 0; i < text.length; i++) {
                var char = text[i];
                var array = null;

                switch (char) {
                    case Importance.POSITIVE:
                        array = positiveRanges;
                        break;
                    case Importance.NEGATIVE:
                        array = negativeRanges;
                        break;
                    default:
                        displayText += char;
                        continue;
                }

                var relIndex = i - offset;
                if (start === -1) {
                    start = relIndex;
                } else {
                    array.push({
                        start: start,
                        end: relIndex
                    });
                    start = -1;
                }
                offset++;
            }

            game.displayText = displayText;
            game.ranges = {
                positive: positiveRanges,
                negative: negativeRanges
            };
        }

        function submit() {

        }

    }

})(createjs, createjs.Tween);