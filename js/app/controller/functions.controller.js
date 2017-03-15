(function (easel, tween) {
    'use strict';

    angular
        .module('matheland.controller')
        .controller('FunctionsController', FunctionsController);

    FunctionsController.$inject = ['$state', 'Ticker', 'CanvasConfig', 'Task', 'Modal'];

    function FunctionsController($state, Ticker, CanvasConfig, Task, Modal) {

        var vm = this;
        vm.submit = submit;
        vm.mistakeCount = 0;

        vm.openModal = function() {
            Modal.open('functionsModal').then(function() {

            });
        };

        var game = {
            objects: {
                coord: {
                    x: {},
                    y: {}
                }
            },
            func: {
                a: null,
                c: null
            }
        };

        vm.input = {
            a: 1,
            c: 0
        };

        var STRETCH_FACTOR_X = 3; //normal (1=1) x coordinates, but 1=1/3 y coordinates
        var APEX = 10;

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

            var thickness = size;

            var marioHeight = size;

            var maxHeight = height - marioHeight - thickness;

            var errorCount = -1;
            var success;
            do {
                game.stage.clear();
                game.stage.removeAllChildren();
                game.objects = {
                    coord: {
                        x: {},
                        y: {}
                    }
                };
                game.stage.update();
                errorCount++;
                if (errorCount > 20) {
                    alert('Es ist ein Fehler aufgetreten. Bitte die Seite neu laden.');
                    throw new Error();
                }
                var stoneHeight = Math.floor(Math.random() * maxHeight);

                stoneGraphics
                    .moveTo(-thickness, 0)
                    .beginFill('#555555')
                    .lineTo(-thickness, -stoneHeight)
                    .arc(0, -stoneHeight, thickness, Math.PI, 0)
                    .lineTo(thickness, 0)
                    .lineTo(-thickness, 0);

                var stone = new easel.Shape(stoneGraphics);
                stone.x = 2 * size;
                stone.y = height;

                game.stage.addChild(stone);

                var stone2 = new easel.Shape(stoneGraphics);
                stone2.x = CanvasConfig.WIDTH - 2 * size;
                stone2.y = height;

                game.stage.addChild(stone2);

                var riverHeight = size / 2;

                var riverGraphics = new easel.Graphics();

                riverGraphics
                    .beginFill('#7777aa')
                    .drawRect(0, 0, CanvasConfig.WIDTH, riverHeight);

                var river = new easel.Shape(riverGraphics);
                river.y = height - riverHeight / 2;

                game.stage.addChild(river);

                var marioFitness = Math.floor(0.25 * size);

                var marioGraphics = new easel.Graphics();

                marioGraphics
                    .beginFill('#dd0000')
                    .drawRect(-marioFitness, 0, 2 * marioFitness, marioHeight);

                var mario = new easel.Shape(marioGraphics);
                mario.x = stone.x;
                mario.y = height - stoneHeight - thickness - marioHeight;

                game.stage.addChild(mario);
                game.objects.mario = mario;

                var coinThickness = marioFitness;
                var coinHeight = marioHeight;

                var coinGraphics = new easel.Graphics();

                coinGraphics
                    .beginFill('#dddd77')
                    .drawEllipse(-coinThickness, 0, 2 * coinThickness, coinHeight);

                var coin = new easel.Shape(coinGraphics);
                coin.x = CanvasConfig.WIDTH / 4 + Math.random() * CanvasConfig.WIDTH / 2;
                var minCoinHeight = riverHeight + marioHeight;
                coin.y = height - (minCoinHeight + Math.random() * ((height - mario.y) - minCoinHeight - coinHeight / 2));

                game.stage.addChild(coin);
                game.objects.coin = coin;

                var marioc = {
                    x: (mario.x - CanvasConfig.WIDTH / 2) / (size * STRETCH_FACTOR_X),
                    y: (height - mario.y) / size,
                    height: marioHeight / size,
                    width: 2 * marioFitness / size
                };
                game.objects.mario.coords = marioc;

                var coinc = {
                    x: (coin.x - CanvasConfig.WIDTH / 2) / (size * STRETCH_FACTOR_X),
                    y: (height - coin.y) / size,
                    height: coinHeight / size,
                    width: 2 * coinThickness / size
                };
                game.objects.coin.coords = coinc;

                success = setFunction(marioc, coinc);
            } while (!success);

            drawCoordinateSystem(CanvasConfig.WIDTH / 2, CanvasConfig.HEIGHT, STRETCH_FACTOR_X, 1);
        }

        function drawCoordinateSystem(cx, cy, xf, yf) {
            //Prep
            xf = xf || 1;
            yf = yf || 1;

            //Init
            var stage = game.stage;
            var height = CanvasConfig.HEIGHT;
            var width = CanvasConfig.WIDTH;
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
            var coord = game.objects.coord;
            coord.grid = new easel.Shape(graphics.grid);
            coord.x.main = new easel.Shape(graphics.x.main);
            coord.x.labels = graphics.x.labels;
            coord.y.main = new easel.Shape(graphics.y.main);
            coord.y.labels = graphics.y.labels;
            stage.addChild(coord.grid);
            stage.addChild(coord.x.main);
            stage.addChild(coord.y.main);
            for (var i = 0; i < coord.x.labels.length; i++) {
                stage.addChild(coord.x.labels[i]);
            }
            for (var j = 0; j < coord.y.labels.length; j++) {
                stage.addChild(coord.y.labels[j]);
            }
        }

        function toRealY(rawY) {
            return CanvasConfig.HEIGHT - rawY;
        }

        function generateFunction(head, coin) {
            var deltaY = head.y - coin.y;
            var deltaF = Math.pow(head.x, 2) - Math.pow(coin.x, 2);
            var a = deltaY / deltaF;
            var c = head.y - a * Math.pow(head.x, 2);
            console.log(a, c);
            if (c <= 0.5) return false;
            return {
                a: a,
                c: c
            };
        }

        function setFunction(headc, coinc) {
            var func = generateFunction(headc, coinc);
            game.func = func;
            return !!func;
        }

        function drawFunction(func) {
            func = func || game.func;
            var RANGE_START = 0;
            var RANGE_END = 20;
            var PRECISION = 0.2;
            var LINE_THICKNESS = 4;
            var graphics = new easel.Graphics().setStrokeStyle(LINE_THICKNESS);
            graphics.lineTo(getCoords(RANGE_START), callFunction(func, RANGE_START - APEX)).beginStroke('#FF5555');
            for (var xrc = RANGE_START - APEX; xrc <= RANGE_END - APEX; xrc += PRECISION) {
                var xc = Math.round(xrc * 100) / 100;
                var x = getCoords(STRETCH_FACTOR_X * xc + APEX);
                var yc = callFunction(func, xc);
                var y = getCoords(yc, true);
                x = Math.round(x);
                y = Math.round(y);
                graphics.lineTo(x, y);
            }
            var line = new easel.Shape(graphics);
            game.stage.addChild(line);
            line.x = 0;
            line.y = 0;
            game.objects.line = line;
        }

        function getCoords(v, negative) {
            if (negative) {
                var yCoords = CanvasConfig.HEIGHT / CanvasConfig.COORDINATE_SIZE;
                v = yCoords - v;
            }
            return v * CanvasConfig.COORDINATE_SIZE;
        }

        function callFunction(func, x) {
            return func.a * Math.pow(x, 2) + func.c;
        }

        function checkWinCondition() {
            var input = vm.input;

            var coin = game.objects.coin.coords;
            var pathYCoin = callFunction(input, coin.x);
            var lowerLimitCoin = coin.y - coin.height;
            var coinOnPath = lowerLimitCoin <= pathYCoin && pathYCoin <= coin.y;

            var mario = game.objects.mario.coords;
            var pathYMario = callFunction(input, mario.x);
            var lowerLimitMario = mario.y - mario.height;
            var marioOnPath = lowerLimitMario <= pathYMario && pathYMario <= mario.y;

            return {
                coinHit: coinOnPath,
                marioHit: marioOnPath,
                win: coinOnPath && marioOnPath,
                missedBoth: !(coinOnPath || marioOnPath)
            };
        }

        function animateFunction(func) {
            var ani = tween.get(game.objects.mario, {override:true});
            func = func || game.func;
            var PRECISION = 0.2;
            for (var xrc = -2.66; xrc <= 2.72; xrc += PRECISION) {
                var xc = Math.round(xrc * 100) / 100;
                var x = getCoords(STRETCH_FACTOR_X * xc + APEX);
                var yc = callFunction(func, xc);
                var y = getCoords(yc, true);
                x = Math.round(x);
                y = Math.round(y);
                ani.to({x: x, y: y}, 100);
            }
            return ani.wait(1000);
        }

        function reset() {
            setTimeout(function() {
                game.stage.removeChild(game.objects.line);
                vm.mistakeCount++;
            }, 1000);
        }

        function submit() {
            var result = checkWinCondition();
            game.stage.removeChild(game.objects.line);
            drawFunction(vm.input);
            if (result.win) {
                animateFunction(vm.input).call(function() {
                    alert("Glückwunsch! Du hast es geschafft!");
                    Ticker.stop();
                    $state.go(Task.VECTORS);
                });
            } else {
                if (!result.marioHit) {
                    console.log("An dieser Liane wird sich Mario nicht festhalten können");
                } else if (!result.coinHit) {
                    console.log("Mario kann zwar die Liane greifen, verfehlt aber die Münze.");
                }
                reset();
            }
        }
    }

})(createjs, createjs.Tween);