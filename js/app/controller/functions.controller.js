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
            setFunction(1, 0);
            console.log(game.func);
            drawFunction();
            console.log(generateFunction({x: -2, y: 3}, {x: 0, y: 1}));
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
            game.stage.addChild(coord.grid);
            game.stage.addChild(coord.x.main);
            game.stage.addChild(coord.y.main);
            for (var i = 0; i < coord.x.labels.length; i++) {
                game.stage.addChild(coord.x.labels[i]);
            }
            for (var j = 0; j < coord.y.labels.length; j++) {
                game.stage.addChild(coord.y.labels[j]);
            }
        }

        function toRealY(rawY) {
            return CanvasConfig.HEIGHT - rawY;
        }

        function generateFunction(cliff, coin) {
            var deltaY = cliff.y - coin.y;
            var deltaF = Math.pow(cliff.x, 2) - Math.pow(coin.x, 2);
            var rawA = deltaY / deltaF;
            var a = Math.round(rawA * 10) / 10;
            var rawC = cliff.y - rawA * Math.pow(cliff.x, 2);
            var c = Math.round(rawC);
            return {
                a: a,
                c: c
            };
        }

        function setFunction(a, c) {
            game.func = {
                a: a,
                c: c
            };
        }

        function drawFunction() {
            var RANGE_START = 0;
            var RANGE_END = 20;
            var PRECISION = 0.2;
            var LINE_THICKNESS = 4;
            var graphics = new easel.Graphics().setStrokeStyle(LINE_THICKNESS);
            graphics.lineTo(getCoords(RANGE_START), callFunction(RANGE_START - APEX)).beginStroke('#FF5555');
            for (var xrc = RANGE_START - APEX; xrc <= RANGE_END - APEX; xrc += PRECISION) {
                var xc = Math.round(xrc * 100) / 100;
                var x = getCoords(STRETCH_FACTOR_X * xc + APEX);
                var yc = callFunction(xc);
                var y = getCoords(yc, true);
                x = Math.round(x);
                y = Math.round(y);
                graphics.lineTo(x, y);
            }
            var line = new easel.Shape(graphics);
            game.stage.addChild(line);
            line.x = 0;
            line.y = 0;
        }

        function getCoords(v, negative) {
            if (negative) {
                var yCoords = CanvasConfig.HEIGHT / CanvasConfig.COORDINATE_SIZE;
                v = yCoords - v;
            }
            return v * CanvasConfig.COORDINATE_SIZE;
        }

        function callFunction(x) {
            return game.func.a * Math.pow(x, 2) + game.func.c;
        }

        function submit() {
            // Check if the center of the shell is in the center of the goal
            if (true) {
                Ticker.stop();
                window.alert("gg ez");
                Forwarder.forward($stateParams);
            }
        }
    }

})(createjs, createjs.Tween);