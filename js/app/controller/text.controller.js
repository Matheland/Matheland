(function (easel, tween) {
    'use strict';

    angular
        .module('matheland.controller')
        .controller('TextController', TextController);

    TextController.$inject = ['Difficulty', '$stateParams', 'Forwarder', 'Ticker'];

    function TextController(Difficulty, $stateParams, Forwarder, Ticker) {
        var vm = this;

        vm.submit = submit;
        vm.reset = reset;

        var Importance = {
            POSITIVE: '*',
            NEGATIVE: '_'
        };

        var task = {
            text: '*HIER* ist ein wichtiger Text. _HIER_ allerdings nicht.'
        };

        vm.game = {};

        init();

        function init() {
            vm.game.task = task;
            processText(task.text);
            var text = document.getElementById('text');
            text.addEventListener('mouseup', function(event) {
                var selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    var baseNode = selection.baseNode.parentNode;
                    var extentNode = selection.extentNode.parentNode;
                    // var baseOut = baseNode.parentNode.getAttribute('id') !== 'text';
                    // var extentOut = extentNode.parentNode.getAttribute('id') !== 'text';
                    // if (baseOut || extentOut) return;
                    var base = baseNode.getAttribute('id');
                    base = +(base.split('-').slice(-1)[0]);
                    var extent = extentNode.getAttribute('id');
                    extent = +(extent.split('-').slice(-1)[0]);
                    var start = Math.min(base, extent);
                    start = start || -1;
                    var end = Math.max(base, extent);
                    for (var i = start + 1; i <= end; i++) {
                        vm.game.marked[i] = !vm.game.marked[i];
                    }
                    remark();
                }
            });
        }

        function remark() {
            for (var i = 0; i < vm.game.marked.length; i++) {
                var element = angular.element(document.getElementById('text-' + i));
                var marked = vm.game.marked[i];
                element.removeClass('last');
                element.removeClass('first');
                if (marked) {
                    element.addClass('marked');
                    var next = i + 1;
                    var after = next < vm.game.marked.length;
                    if (after && !vm.game.marked[next]) {
                        element.addClass('last');
                    }
                } else {
                    element.removeClass('marked');
                }
            }
            clearSelection();
        }

        function clearSelection() {
            if (window.getSelection) {
                if (window.getSelection().empty) {  // Chrome
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) {  // Firefox
                    window.getSelection().removeAllRanges();
                }
            } else if (document.selection) {  // IE?
                document.selection.empty();
            }
        }

        function reset() {
            processText(task.text);
            remark();
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

            vm.game.displayText = displayText;
            vm.game.marked = marked;
            vm.game.ranges = {
                positive: positiveRanges,
                negative: negativeRanges
            };
        }

        function submit() {
            var win = true;
            var game = vm.game;

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
                alert('Toll');
                console.log($stateParams);
                Forwarder.forward($stateParams);
            } else {
                alert('Nicht so toll');
            }
        }

    }

})(createjs, createjs.Tween);