(function (){
        angular
            .module('matheland.controller')
            .controller('StartController', StartController);

        StartController.$inject = ['$state', 'Task'];

        function StartController($state, Task) {
            var vm = this;

            vm.startGame = startGame;

            function startGame() {
                $state.go(Task.FUNCTIONS);
            }

        }
    }
)();
