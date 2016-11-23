(function () {
    'use strict';

    var CanvasConfig = {
        ID: "canvas",
        WIDTH: 720,
        HEIGHT: 300,
        COORDINATE_SIZE: 36,
        NUMBER_OF_X_COORDINATES: 20,
        NUMBER_OF_Y_COORDINATES: 8
    };

    angular
        .module('matheland.constant')
        .constant('CanvasConfig', CanvasConfig);
})();