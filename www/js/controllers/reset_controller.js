app.controller('reset_ctrl', ['$scope','$state',
	function($scope, $state){

		$scope.resetPassword = function(email){

			$scope.msg = {};

			if ($scope.resetform.$valid){
				console.log(email);

				firebase.auth().sendPasswordResetEmail(email).then(function(){
					console.log('enviamos correo');
					$scope.msg.email_sent = true;

				}).catch(function(error){
					switch(error.code){
					 	case 'auth/user-not-found':
						 	$scope.$apply(function(){
						  	 $scope.msg.email_not_exist = true;
						  });
						 	break;
						 default:
						 	$scope.$apply(function(){
						  	 $scope.msg.error_text = true;
						  });
						 	break;
					 }
				});
			}
		}

		$scope.back = function(){
			$state.go('login');
		}


}]);