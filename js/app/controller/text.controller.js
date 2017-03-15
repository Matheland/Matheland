(function (easel, tween) {
    'use strict';

    angular
        .module('matheland.controller')
        .controller('TextController', TextController);

    TextController.$inject = ['$state', 'Task', 'Modal'];

    function TextController($state, Task, Modal) {
        var vm = this;

        vm.submit = submit;
        vm.reset = reset;

        vm.openModal = function() {
            Modal.open('vectorsModal').then(function() {

            });
        };

        var Importance = {
            POSITIVE: '*',
            NEGATIVE: '_'
        };

        var task = {
            text: 'Peach ist in dem *12m* hohen Turm von Bowser ganz oben gefangen. _Mario schreitet zur Hilfe aber dafür muss er Bowser überlisten. Bowser hat einen großen braunen stachligen Panzer an dem Mario vorbeikommen muss, da Peach sonst nicht gerettet werden kann. Bowser selbst ist 3m groß und sein längster Stachel ragt weitere 30cm in die Luft._ Mario entdeckt beim Erkunden der Umgebung in einer Schubkarre *15 verschieden große quadratische* Ziegel mit einem *Gesamtvolumen* von *20m³*. *5* davon sind rot mit einem Volumen von *1m³*. Ein weiteres *Drittel* ist grün und *doppelt* so groß *wie die restlichen blauen*. Wie lautet die Mindestanzahl an Ziegeln die Mario benötigt, um Peach vor Bowser zu retten?'
        };

        vm.game = {};

        init();

        function init() {
            vm.game.task = task;
            processText(task.text);
            var text = document.getElementById('text');
            text.addEventListener('mouseup', function() {
                var selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    var baseNode = selection.baseNode.parentNode;
                    var extentNode = selection.extentNode.parentNode;
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
                $state.go(Task.START);
            } else {
                alert('Nicht so toll');
            }
        }

    }

})(createjs, createjs.Tween);