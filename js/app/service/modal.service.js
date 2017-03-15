(function () {
    'use strict';

    angular
        .module('matheland.service')
        .service('Modal', Modal);

    Modal.$inject = ['$uibModal'];

    function Modal($uibModal) {
        var service = this;

        service.open = open;

        function open(name, controller) {
            var modal = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: name + '.html',
                controller: controller ? controller : 'ModalController',
                controllerAs: 'modal'
            });
            return modal.result;
        }

    }

})();