(function (){
        angular
            .module('matheland.controller')
            .controller('NavController', NavController);

        function NavController($state, Task) {
            var vm = this;

            vm.showNav = function() {
                return $state.current.name !== 'start';
            };

            vm.goToStart = function() {
                $state.go(Task.START);
            }

        }
    }
)();
