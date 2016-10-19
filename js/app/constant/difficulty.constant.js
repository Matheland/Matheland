(function () {
    'use strict';

    var Difficulty = {
        EASY: 1,
        NORMAL: 2,
        HARD: 3
    };

    angular
        .module('matheland.constant')
        .constant('Difficulty', Difficulty);

})();