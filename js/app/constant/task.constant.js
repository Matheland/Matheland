(function () {
    'use strict';

    var Task = {
        VECTOR: 'vectors',
        FUNCTION: 'functions',
        TEXT: 'text'
    };

    angular
        .module('matheland.constant')
        .constant('Task', Task)
})();