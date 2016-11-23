(function (easel, tween) {
    'use strict';

    angular
        .module('matheland.controller')
        .controller('VectorsController', VectorsController);

    function VectorsController($stateParams, Forwarder, Ticker) {

        var vm = this;
        vm.submit = submit;

        var game = {
            objects: {
                pipes: []
            }
        };

        var canvas = 'canvas';

        init();

        function init() {
            game.stage = new easel.Stage(canvas);

            Ticker.start(game.stage);
            createBoard();
        }

        function createBoard() {
            /*
             The number of obstacles depends on the difficulty of the task.
             EASY    -> three obstacles
             MEDIUM  ->  four obstacles
             HARD    ->  five obstacles
             */
            var numberOfObstacles = $stateParams.difficulty + 2;

            // Create shell
            var shellGraphics = easel.Graphics
                .beginFill('#F34C32')
                .arc(0, 0, 20, 0, Math.PI * 2);

            game.objects.shell = easel.Shape(shellGraphics);

            // Create pipes
            for (var i = 0; i < numberOfObstacles; i++) {
                var width = 48;
                var height = Math.floor(Math.random() + (game.stage.height / 2)) + (game.stage.height / 4);

                var pipeGraphics = easel.Graphics
                    .beginFill('#79FB73')
                    .drawRect(0, 0, width, height);
                var pipe = easel.Shape(pipeGraphics);

                game.objects.pipes.push(pipe);
            }

            // Create goal
            var goalGraphics = easel.Graphics
                .beginFill('#FFFFFF')
                .arc(0, 0, 22.5, 0, Math.PI * 2);

            game.objects.goal = easel.Shape(goalGraphics);
        }

        function submit() {
            Ticker.stop();
            Forwarder.forward($stateParams);
        }

    }

})(createjs, createjs.Tween);