app.controller('navbar_ctrl', ['$scope', '$mdSidenav', function($scope,$mdSidenav){

	$scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

}]);