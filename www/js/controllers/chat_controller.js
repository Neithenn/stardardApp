
app.service('SocketService', ['socketFactory', SocketService]);

	function SocketService(socketFactory){
		return socketFactory({
			ioSocket: io.connect('http://192.168.0.115:8081')
		});
	}

app.controller('chat_ctrl',['$scope','$state','$stateParams','$localStorage','SocketService','getSavedChats',
 function($scope, $state, $stateParams, $localStorage, SocketService, getSavedChats){

 	$scope.friend_user = $stateParams.friend;
 	$scope.user = $localStorage.user;
	$scope.oldMsg = [];	
 	$scope.arrayMsg = [];

 	$scope.init = function(){
 		/*
 		var participants = {
			user_a: $scope.user.email,
			user_b: $scope.friend_user
		}
	
 		SocketService.emit('saved:messages', participants);
		*/
		getSavedChats.query({user_a: $scope.user.email, user_b: $scope.friend_user}, function(msgs){
			console.log(msgs);
			for (var i = 0, len = msgs.length; i < len; i++) {
				$scope.oldMsg.push({message: msgs[i].message, sender: msgs[i].sender});
			}


		},function(err){
			console.log('hubo un error al traer los mensajes');
		})

 	}

 	$scope.init();

	$scope.sendmessage = function(){
		
		var msg = {
			user_a: $scope.user.email,
			user_b: $scope.friend_user,
			msg: $scope.message
		}

		SocketService.emit('send:message', msg);
		$scope.message = '';
		$scope.arrayMsg.push(msg.msg);
	}

	$scope.salirChat = function(){


	}

	SocketService.on('initial:broadcast', function(msgs){
		debugger;
		for (var i = 0, len = msgs.length; i < len; i++) {
			$scope.oldMsg.push({message: msgs[i].message, sender: msgs[i].sender});
		}
		
	})

	SocketService.on('broadcast', function(msg){
		debugger;
		$scope.arrayMsg.push(msg);
	})

}]);