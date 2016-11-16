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

        var game = {};

        init();

        function init() {
            game.task = task;
            game.shapes = [];
            processText(task.text);
            game.stage = new easel.Stage('canvas');
            Ticker.start(game.stage);
            setup();
        }

        function processText(text) {
            var displayText = "";
            var offset = 0;
            var start = -1;
            var positiveRanges = [];
            var negativeRanges = [];
            var marked = [];

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
                        marked.push(false);
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
            game.marked = marked;
            game.ranges = {
                positive: positiveRanges,
                negative: negativeRanges
            };
        }

        function setup() {
            var offsetX = 10;
            for (var i = 0; i < game.displayText; i++) {
                var text = createjs.Text(game.displayText[i], "48px Arial", "#000");
                text.y = 10;
                text.x = offsetX;
                text.charIndex = i;
                offsetX += text.getMeasuredWidth();
                game.shapes.push(text);
                text.on('mousedown', handleSelection);
                text.on('mouseup', handleSelection);
                stage.addChild(text);
            }
            game.stage.update();
        }

        function handleSelection(event) {
            var text = event.relatedTarget;
            var index = text.charIndex;
            if (event.type === 'mousedown') {
                game.activeStart = index;
            } else if (event.type === 'mouseup') {
                var end = index;
                if (end < start) {
                    var h = end;
                    end = start;
                    start = h;
                }
                game.activeStart = null;

            }
        }

        function submit() {
            var win = true;

            detectionLoop:
            for (var i = 0; i < game.marked.length; i++) {
                var mark = game.marked[i];
                for (var k = 0; k < game.ranges.positive.length; k++) {
                    var prange = game.ranges.positive[k];
                    var paffected = prange.start <= i && i < prange.end;
                    if (paffected && !mark) {
                        win = false;
                        break detectionLoop;
                    }
                }
                for (var m = 0; m < game.ranges.negative.length; m++) {
                    var nrange = game.ranges.negative[m];
                    var naffected = nrange.start <= i && i < nrange.end;
                    if (naffected && mark) {
                        win = false;
                        break detectionLoop;
                    }
                }
            }

            if (win) {
                alert('gg ez');
                Ticker.stop();
                Forwarder.forward($stateParams);
            } else {
                alert('get rekt n00b');
            }
        }

    }

})(createjs, createjs.Tween);