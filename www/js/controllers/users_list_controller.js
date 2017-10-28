app.controller('user_list_ctrl', ['$scope','getUsers','$localStorage', '$state','SocketService',
 function($scope, getUsers, $localStorage, $state, SocketService){

$scope.init = function(){
	$scope.users_list = [];
	getUsers.get({token: $localStorage.userToken}, function(users){
		
		for (key in users.list){
			if (key != $localStorage.user.email){
				$scope.users_list.push(key);
			}
		}

	}, function(error){
		console.log('hubo un error al buscar los usuarios'+ error);
	})

}

$scope.init();

$scope.gotochat = function(user){

	var participants = {
		user_a: $localStorage.user.email,
		user_b: user
	}

	SocketService.emit('join:chat', participants)

	$state.go('chat', {friend: user});
}


}])