(function (easel, tween) {
    'use strict';

    angular
        .module('matheland.controller')
        .controller('VectorsController', VectorsController);

    function VectorsController($stateParams, Forwarder, Ticker, CanvasConfig) {

        var vm = this;

        vm.submit = submit;

        vm.input = {
            x: 0,
            y: 0
        };

        var game = {
            objects: {
                pipes: []
            },
            coordinates: {
                x: [],
                y: [],
                xOrigin: 0,
                yOrigin: 6,
            },
            mightCollide: false,
            tween: null
        };

        init();

        function init() {
            game.stage = new easel.Stage(CanvasConfig.ID);

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

            // var numberOfObstacles = $stateParams.difficulty + 2;
            var numberOfObstacles = 1 + 2;

            // var pipeMinHeight = 3 - Math.floor($stateParams.difficulty / 3);
            var pipeMinHeight = 3 - Math.floor(1 / 3);
            var coordinateSize = CanvasConfig.COORDINATE_SIZE;
            var yOrigin = game.coordinates.yOrigin;

            // Fill coordinates array with ... well, coordinates
            for (
                var crdX = CanvasConfig.COORDINATE_SIZE;
                crdX <= (CanvasConfig.NUMBER_OF_X_COORDINATES - 1) * CanvasConfig.COORDINATE_SIZE;
                crdX += CanvasConfig.COORDINATE_SIZE
            ) {
                game.coordinates.x.push(crdX);
            }

            for (
                var crdY = CanvasConfig.COORDINATE_SIZE;
                crdY <= (CanvasConfig.NUMBER_OF_Y_COORDINATES - 1) * CanvasConfig.COORDINATE_SIZE;
                crdY += CanvasConfig.COORDINATE_SIZE
            ) {
                game.coordinates.y.push(crdY + yOrigin);
            }

            // Define middle
            var middleY = game.coordinates.y[Math.floor(game.coordinates.y.length / 2)];

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
            shell.y = middleY;

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
                var y = pipeFromAbove ? yOrigin : CanvasConfig.NUMBER_OF_Y_COORDINATES * CanvasConfig.COORDINATE_SIZE;

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

                pipe.setBounds(-1, -1, pipeWidth + 2, pipeHeight + 2);
                pipe.x = x;
                pipe.y = pipeFromAbove ? y : y - pipeHeight + yOrigin;

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
            goal.y = middleY;

            game.objects.goal = goal;
            game.stage.addChild(game.objects.goal);

            game.stage.setChildIndex(game.objects.shell, game.stage.getNumChildren() - 1);
        }

        function submit(relativeX, relativeY) {
            tween
                .get(game.objects.shell)
                .to(
                    relativeX
                )
                .call(checkWinCondition);
        }

        function checkWinCondition(t) {
            game.mightCollide = false;
            t.removeAllEventListeners();

            var shell = t.target;
            var goal = game.objects.goal;
            var position = goal.globalToLocal(shell.x, shell.y);

            // Check if the center of the shell is in the center of the goal
            if (goal.hitTest(position.x, position.y)) {
                Ticker.stop();
                window.alert("gg ez");
                Forwarder.forward($stateParams);
            }
        }

        function checkCollision(x, y) {
            x = Math.ceil(x);
            y = Math.ceil(y);
            if (
                x <= game.coordinates.xOrigin ||
                y <= game.coordinates.yOrigin ||
                x > game.coordinates.x[game.coordinates.x.length - 1] ||
                y > game.coordinates.y[game.coordinates.y.length - 1]
            ) {
                return true;
            } else {
                for (var i = 0; i < game.objects.pipes.length; i++) {
                    var pipe = game.objects.pipes[i];
                    var pt = pipe.globalToLocal(x, y);

                    pt.x = !pt.x ? pt.x : pt.x - 1;
                    pt.y = !pt.y ? pt.y : pt.y - 1;

                    if (pipe.hitTest(pt.x, pt.y)) {
                        return true;
                    }
                }
            }

            return false;
        }

        function collisionDetection() {

        }
    }

})(createjs, createjs.Tween);
