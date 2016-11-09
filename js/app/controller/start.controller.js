(function (){
        angular
            .module('matheland.controller')
            .controller('StartController', StartController);

        function StartController($scope, $state, Difficulty) {

            $scope.startGame = startGame();

            function startGame() {
                $state.go('functions',{
                    $difficulty: Difficulty.EASY
                });
            }

        }
    }
)()
