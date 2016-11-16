(function (){
        angular
            .module('matheland.controller')
            .controller('StartController', StartController);

        function StartController() {

            $scope.startGame = startGame;

            function startGame() {
            }

        }
    }
)();
