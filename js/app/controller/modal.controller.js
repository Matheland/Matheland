(function (){
        angular
            .module('matheland.controller')
            .controller('ModalController', ModalController);

        ModalController.$inject = ['$uibModalInstance'];

        function ModalController($uibModalInstance) {
            var modal = this;

            /**
             * Closes the modal
             */
            modal.ok = function () {
                $uibModalInstance.close();
            };
        }
    }
)();
