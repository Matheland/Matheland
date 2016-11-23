(function (){
        angular
            .module('matheland.controller')
            .controller('StartController', StartController);

        StartController.$inject = ['Forwarder'];

        function StartController(Forwarder) {
            var vm = this;

            vm.startGame = startGame;

            function startGame() {
                Forwarder.forward();
            }

        }
    }
)();
