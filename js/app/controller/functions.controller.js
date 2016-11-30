(function (easel, tween) {
    'use strict';

    angular
        .module('matheland.controller')
        .controller('FunctionsController', FunctionsController);

    function FunctionsController($stateParams, Forwarder, Ticker, CanvasConfig) {

        var vm = this;
        vm.submit = submit;

        var game = {
            objects: {
                pipes: []
            }
        };

        init();

        function init() {
            game.stage = new easel.Stage(CanvasConfig.ID);

            Ticker.start(game.stage);
            createBoard();
        }

        function createBoard() {
            var stoneGraphics = new easel.Graphics();

            var size = CanvasConfig.COORDINATE_SIZE;
            var height = CanvasConfig.HEIGHT;

            // stoneGraphics
            //     .lineTo(size, height)
            //     .beginFill('#555555')
            //     .lineTo(size, size * 2)
            //     .arc(size * 2, size * 2, size / 2, Math.PI, 0);
            //     //.lineTo(size * 2, height)
            //     //.lineTo(size, height);

            var thickness = size;

            stoneGraphics
                .lineTo(-thickness, 0)
                .beginFill('#555555')
                .lineTo(-thickness, 3 * thickness - height)
                .arc(0, 3 * thickness - height, thickness, Math.PI, 0)
                .lineTo(thickness, 0)
                .lineTo(-thickness, 0);

            var stone = new easel.Shape(stoneGraphics);
            stone.x = 2 * size;
            stone.y = height;

            game.stage.addChild(stone);

            // var numberOfObstacles = $stateParams.difficulty + 2;
            var numberOfObstacles = 1 + 2;

            // var pipeMinHeight = 3 - Math.floor($stateParams.difficulty / 3);
            var pipeMinHeight = 3 - Math.floor(1 / 3);
            var coordinateSize = CanvasConfig.COORDINATE_SIZE;
            // var yOrigin = 6;

            // ------------------------------------------------------------------------------------------------------ //

            // Create shell
            var shellGraphics = new easel.Graphics();

            shellGraphics
                .beginFill('#F34C32')
                .arc(
                    0,
                    0,
                    coordinateSize / 2,
                    0,
                    Math.PI * 2
                );

            var shell = new easel.Shape(shellGraphics);

            shell.setBounds(
                -coordinateSize,
                -coordinateSize,
                coordinateSize * 2,
                coordinateSize * 2
            );

            shell.x = coordinateSize;
            shell.y = coordinateSize * 4; //+ yOrigin;

            game.objects.shell = shell;
            game.stage.addChild(shell);

            // ------------------------------------------------------------------------------------------------------ //

            // Create pipes
            var remainingSpacingForPipes = 14 - numberOfObstacles;

            for (var i = 0; i < numberOfObstacles; i++) {
                var pipeWidth = coordinateSize;
                var pipeHeight = (Math.floor(Math.random() * 3) + pipeMinHeight) * coordinateSize;
                var pipeFromAbove = Math.round(Math.random());
                var x = coordinateSize;
                var y = pipeFromAbove ? 0 /* yOrigin */ : CanvasConfig.HEIGHT; //- yOrigin;

                if (i) {
                    var randomSpacing = (Math.floor(Math.random() * 3) + 2);

                    while (remainingSpacingForPipes - randomSpacing < 0) {
                        randomSpacing--;
                    }

                    x += game.objects.pipes[game.objects.pipes.length - 1].x + randomSpacing * x;
                } else {
                    if (Math.round(Math.random())) {
                        x = x * 5;
                        remainingSpacingForPipes--;
                    } else {
                        x = x * 4;
                    }
                }

                var pipeGraphics = new easel.Graphics();

                pipeGraphics
                    .beginFill('#79FB73')
                    .drawRect(
                        0,
                        0,
                        pipeWidth,
                        pipeHeight
                    );

                var pipe = new easel.Shape(pipeGraphics);

                pipe.setBounds(0, 0, pipeWidth, pipeHeight);
                pipe.x = x;
                pipe.y = pipeFromAbove ? y : y - pipeHeight;

                game.objects.pipes.push(pipe);
                game.stage.addChild(pipe);
            }

            // ------------------------------------------------------------------------------------------------------ //

            // Create goal
            var goalGraphics = new easel.Graphics();

            goalGraphics
                .beginFill('#000000')
                .arc(
                    0,
                    0,
                    coordinateSize / 2,
                    0,
                    Math.PI * 2
                );

            var goal = new easel.Shape(goalGraphics);
            goal.x = coordinateSize * 19;
            goal.y = coordinateSize * 4; //+ yOrigin;

            game.objects.goal = goal;
            game.stage.addChild(game.objects.goal);
        }

        function submit(relativeX, relativeY) {
            tween
                .get(game.objects.shell)
                .to(
                    relativeX
                )
                .call(checkWinCondition);
        }

        function checkWinCondition() {
            // Check if the center of the shell is in the center of the goal
            if (game.objects.goal.hitTest(game.objects.shell.x, game.objects.shell.y)) {
                Ticker.stop();
                window.alert("gg ez");
                Forwarder.forward($stateParams);
            }
        }

        function collisionDetection() {

        }
    }

})(createjs, createjs.Tween);