(function () {
    'use strict';

    var Task = {
        VECTORS: 'vectors',
        FUNCTIONS: 'functions',
        TEXT: 'text',
        START: 'start'
    };

    angular
        .module('matheland.constant')
        .constant('Task', Task)
})();