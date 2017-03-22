(function (easel, tween) {
    'use strict';

    angular
        .module('matheland.controller')
        .controller('VectorsController', VectorsController);

    function VectorsController($state, Ticker, CanvasConfig, Task, Modal) {

        var vm = this;

        vm.submit = submit;

        vm.input = {
            x: 0,
            y: 0
        };

        vm.openModal = function() {
            Modal.open('vectorsModal').then(function() {

            });
        };

        var game = {
            objects: {
                pipes: [],
                coordinates: {
                    x: {},
                    y: {}
                }
            },
            coordinates: {
                x: [],
                y: [],
                xOrigin: 0,
                yOrigin: 0,
                lastSafeCoordinates: null
            },
            canvas: {
                height: 288,
                width: CanvasConfig.WIDTH
            },
            mightCollide: false,
            tween: null,
            lastArrowStep: null
        };

        init();

        function init() {
            game.stage = new easel.Stage(CanvasConfig.ID);

            Ticker.start(game.stage, collisionDetection);
            createBoard();
        }

        function createBoard() {
            /*
             The number of obstacles depends on the difficulty of the task.
             EASY    -> three obstacles
             MEDIUM  ->  four obstacles
             HARD    ->  five obstacles
             */

            var numberOfObstacles = 1 + 2;

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

            drawCoordinateSystem(0, game.canvas.height - game.coordinates.yOrigin);

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

        function drawCoordinateSystem(cx, cy, xf, yf) {
            //Prep
            xf = xf || 1;
            yf = yf || 1;

            //Init
            var stage = game.stage;
            var height = game.canvas.height;
            var width = game.canvas.width;
            var sizeX = Math.floor(CanvasConfig.COORDINATE_SIZE * xf);
            var sizeY = Math.floor(CanvasConfig.COORDINATE_SIZE * yf);
            var minX = cx - Math.floor(cx / sizeX) * sizeX;
            var fakeCY = toRealY(cy);
            var minY = fakeCY - Math.floor(fakeCY / sizeY) * sizeY;
            var graphics = {
                grid: new easel.Graphics(),
                x: {
                    main: new easel.Graphics(),
                    labels: []
                },
                y: {
                    main: new easel.Graphics(),
                    labels: []
                }
            };

            var UD_TICK_LENGTH = 4;
            var grid = graphics.grid;
            var mainX = graphics.x.main;
            var mainY = graphics.y.main;
            var labelsX = graphics.x.labels;
            var labelsY = graphics.y.labels;
            grid.setStrokeStyle(0.75, 'round');
            mainX.setStrokeStyle(2, 'round');
            mainY.setStrokeStyle(2, 'round');

            //Grid, Ticks und Labels
            for (var x = minX; x <= width; x += sizeX) {
                grid
                    .beginStroke('#DDD')
                    .moveTo(x, 0)
                    .lineTo(x, height)
                    .endStroke();
                mainX
                    .beginStroke('#000')
                    .moveTo(x, cy + UD_TICK_LENGTH)
                    .lineTo(x, cy - UD_TICK_LENGTH)
                    .endStroke();
                var rx = (x - cx) / sizeX;
                if (rx == 0) continue;
                var label = new easel.Text('' + rx, 'bold 14px Arial', '#333');
                label.x = x + 10;
                label.y = cy - 20;
                label.textAlign = 'center';
                labelsX.push(label);
            }
            for (var y = minY; y <= height; y += sizeY) {
                var realY = toRealY(y);
                grid
                    .beginStroke('#DDD')
                    .moveTo(0, realY)
                    .lineTo(width, realY)
                    .endStroke();
                mainY
                    .beginStroke('#000')
                    .moveTo(cx + UD_TICK_LENGTH, realY)
                    .lineTo(cx - UD_TICK_LENGTH, realY)
                    .endStroke();
                var ry = (cy - realY) / sizeY;
                var label = new easel.Text('' + ry, 'bold 14px Arial', '#333');
                label.x = cx + 10;
                label.y = realY - 20;
                label.textAlign = 'center';
                labelsY.push(label);
            }

            //Achsen
            mainX
                .beginStroke('#000')
                .moveTo(0, cy)
                .lineTo(width, cy)
                .endStroke();
            mainY
                .beginStroke('#000')
                .moveTo(cx, 0)
                .lineTo(cx, height)
                .endStroke();

            //Finish
            var coordinates = game.objects.coordinates;
            coordinates.grid = new easel.Shape(graphics.grid);
            coordinates.x.main = new easel.Shape(graphics.x.main);
            coordinates.x.labels = graphics.x.labels;
            coordinates.y.main = new easel.Shape(graphics.y.main);
            coordinates.y.labels = graphics.y.labels;
            game.stage.addChild(coordinates.grid);
            game.stage.addChild(coordinates.x.main);
            game.stage.addChild(coordinates.y.main);

            for (var i = 0; i < coordinates.x.labels.length; i++) {
                game.stage.addChild(coordinates.x.labels[i]);
            }
            for (var j = 0; j < coordinates.y.labels.length; j++) {
                game.stage.addChild(coordinates.y.labels[j]);
            }
        }

        function toRealY(rawY) {
            return game.canvas.height - rawY;
        }

        function drawArrow(targetX, targetY) {
            var arrow = new easel.Shape();
            var shell = game.objects.shell;

            arrow.graphics
                .beginStroke('red')
                .moveTo(shell.x, shell.y);

            var cmd = arrow.graphics.lineTo(shell.x, shell.y).command;

            var arrowHead = new easel.Shape();

            // Math.pow(18, 2) = Math.pow(x, 2) + Math.pow(x, 2) -> 9 * Math.sqrt(2)
            arrowHead.graphics
                .beginStroke('red')
                .moveTo(-9 * Math.sqrt(2), -9 * Math.sqrt(2))
                .lineTo(0, 0)
                .lineTo(-9 * Math.sqrt(2), 9 * Math.sqrt(2));

            arrowHead.x = shell.x;
            arrowHead.y = shell.y;

            var deltaX = targetX - shell.x;
            var deltaY = targetY - shell.y;

            if (!deltaY) {
                arrowHead.rotation = (Math.abs(deltaX) / deltaX > 0) ? 0 : 180;
            } else if (!deltaX) {
                arrowHead.rotation = 90 * Math.abs(deltaY) / deltaY;
            } else {
                arrowHead.rotation = ((deltaX > 0 && deltaY < 0) ? Math.PI / 2 - Math.atan2(deltaX, deltaY) : Math.atan2(deltaY, deltaX)) * 180 / Math.PI
            }

            game.stage.addChild(arrow);
            game.stage.addChild(arrowHead);

            tween
                .get(arrowHead)
                .to({
                        x: targetX,
                        y: targetY
                    },
                    500,
                    easel.Ease.getPowOut(2.5)
                );

            tween.get(cmd)
                .to({
                        x: targetX,
                        y: targetY
                    },
                    500,
                    easel.Ease.getPowOut(2.5)
                );

            game.stage.setChildIndex(game.objects.shell, game.stage.getNumChildren() - 1);
        }

        function submit() {
            var t = tween.get(game.objects.shell);

            var targetX = vm.input.x * CanvasConfig.COORDINATE_SIZE + t.target.x;
            var targetY = -1 * vm.input.y * CanvasConfig.COORDINATE_SIZE + t.target.y;

            game.mightCollide = true;

            t
                .to({
                        x: targetX,
                        y: targetY
                    },
                    500,
                    easel.Ease.getPowOut(2.5)
                )
                .call(checkWinCondition, [t]);

            drawArrow(targetX, targetY);

            game.tween = t;
        }

        function checkWinCondition(t) {
            game.mightCollide = false;
            t.removeAllEventListeners();

            var shell = t.target;
            var goal = game.objects.goal;
            var position = goal.globalToLocal(shell.x, shell.y);

            // Check if the center of the shell is in the center of the goal
            if (goal.hitTest(position.x, position.y)) {
                tween.removeAllTweens();
                Ticker.stop();
                Modal.open('winModal').then(function() {
                    $state.go(Task.TEXT);
                });

            }
        }

        function checkCollision(x, y) {
            x = Math.ceil(x);
            y = Math.ceil(y);

            if (
                x <= game.coordinates.xOrigin + 1 ||
                y <= game.coordinates.yOrigin + 1 ||
                x > game.coordinates.x[game.coordinates.x.length - 1] + CanvasConfig.COORDINATE_SIZE ||
                y >= game.coordinates.y[game.coordinates.y.length - 1] + CanvasConfig.COORDINATE_SIZE
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
            if (game.mightCollide) {
                var shell = game.objects.shell;
                var oldCoordinates = [shell.x, shell.y];

                var x = oldCoordinates[0];
                var y = oldCoordinates[1];

                var oldTweenSteps = game.tween._steps[0];

                var collided = checkCollision(x, y);

                if (collided) {
                    tween.removeAllTweens();
                    game.mightCollide = false;

                    // Find closest coordinate
                    var closestCoordinates = [
                        {
                            possibilities: game.coordinates.x,
                            value: oldCoordinates[0],
                            delta: Infinity
                        },
                        {
                            possibilities: game.coordinates.y,
                            value: oldCoordinates[1],
                            delta: Infinity
                        }
                    ];

                    var finalCoordinates = {
                        x: null,
                        y: null
                    };

                    for (var a = 0; a < closestCoordinates.length; a++) {
                        for (var b = 0; b < closestCoordinates[a].possibilities.length; b++) {
                            var delta = Math.abs(oldCoordinates[a] - closestCoordinates[a].possibilities[b]);

                            if (delta < closestCoordinates[a].delta) {
                                closestCoordinates[a].value = closestCoordinates[a].possibilities[b];
                                closestCoordinates[a].delta = delta;
                            }
                        }
                    }

                    if (checkCollision(closestCoordinates[0].value, closestCoordinates[1].value)) {
                        var yMovementOnly = oldTweenSteps.p1.x == oldTweenSteps.p0.x;
                        var xMovementOnly = oldTweenSteps.p1.y == oldTweenSteps.p0.y;
                        var isInverseX = oldTweenSteps.p1.x - oldTweenSteps.p0.x < 0;
                        var isInverseY = oldTweenSteps.p1.y - oldTweenSteps.p0.y < 0;

                        if (yMovementOnly) {
                            finalCoordinates.x = closestCoordinates[0].value;
                            finalCoordinates.y = closestCoordinates[1].value - CanvasConfig.COORDINATE_SIZE * (isInverseY ? -1 : 1);
                        } else if (xMovementOnly) {
                            finalCoordinates.x = closestCoordinates[0].value - CanvasConfig.COORDINATE_SIZE * (isInverseX ? -1 : 1);
                            finalCoordinates.y = closestCoordinates[1].value;
                        } else {
                            finalCoordinates.x = closestCoordinates[0].value - CanvasConfig.COORDINATE_SIZE * (isInverseX ? -1 : 1);
                            finalCoordinates.y = closestCoordinates[1].value + CanvasConfig.COORDINATE_SIZE * (isInverseY ? -1 : 1);

                            if (finalCoordinates.y <= game.coordinates.yOrigin) {
                                finalCoordinates.y = game.coordinates.y[0];
                            } else if (finalCoordinates.y > game.coordinates.y[game.coordinates.y.length - 1]) {
                                finalCoordinates.y = game.coordinates.y[game.coordinates.y.length - 1];
                            }
                        }
                    } else {
                        finalCoordinates.x = closestCoordinates[0].value;
                        finalCoordinates.y = closestCoordinates[1].value;
                    }

                    var t = tween
                        .get(game.objects.shell)
                        .to({
                                x: finalCoordinates.x,
                                y: finalCoordinates.y
                            },
                            500,
                            easel.Ease.getPowOut(2.5)
                        );

                    drawArrow(finalCoordinates.x, finalCoordinates.y);

                    t.call(checkWinCondition, [t]);
                }
            }
        }
    }

})(createjs, createjs.Tween);
