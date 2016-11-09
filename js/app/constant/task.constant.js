(function () {
    'use strict';

    var Task = {
        VECTORS: 'vectors',
        FUNCTIONS: 'functions',
        TEXT: 'text'
    };

    angular
        .module('matheland.constant')
        .constant('Task', Task)
})();