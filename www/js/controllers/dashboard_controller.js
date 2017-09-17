app.controller('dashboard_ctrl', ['$scope','$localStorage','$state', function($scope, $localStorage, $state){

$scope.init = function(){
	debugger;
	if ($localStorage.user == undefined || $localStorage.user == null){

		$state.go('login');

	}else{

		$scope.user = {};
		$scope.user.nombre = $localStorage.user.nombre;
		$scope.user.email = $localStorage.user.email;
		$scope.user.photo = $localStorage.user.photo;
		$scope.user.provider = $localStorage.user.provider;
		$scope.userToken = $localStorage.userToken;
	}


}

$scope.init();


}])