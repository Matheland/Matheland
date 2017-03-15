(function (){
        angular
            .module('matheland.controller')
            .controller('ModalController', ModalController);

        ModalController.$inject = ['$uibModalInstance'];

        function ModalController($uibModalInstance) {
            var modal = this;

            modal.ok = function () {
                $uibModalInstance.close();
            };
        }
    }
)();
