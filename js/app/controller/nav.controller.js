(function (){
        angular
            .module('matheland.controller')
            .controller('NavController', NavController);

        function NavController($state, Task) {
            var vm = this;

            /**
             * Returns whether or not the game has already been started.
             * @returns {boolean} true if the navigation should be shown, false otherwise
             */
            vm.showNav = function() {
                return $state.current.name !== 'start';
            };

            /**
             * Aborts the current game and redirects the player to the start page.
             */
            vm.goToStart = function() {
                $state.go(Task.START);
            }

        }
    }
)();
