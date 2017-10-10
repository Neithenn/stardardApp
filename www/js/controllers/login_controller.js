

app.controller('login_ctrl', ['$scope','getInfo','getToken', '$localStorage', 'fetchmessage', '$state','$FCMPlugin', function($scope,getInfo, getToken, $localStorage, fetchmessage, $state,$FCMPlugin){


$scope.init = function(){
	//obtengo un string de la api
	getInfo.get(null, function(result){
		$scope.dataUser= result.prueba;
	},function(error){
		console.log('hubo un error'+error);
	});

	//AGARRO EL CALL BACK
	var isApp = !document.URL.startsWith('http');

	if (window.cordova && !isApp) {
		firebase.auth().getRedirectResult().then(function(result) {		  
			//TENGO QUE METER UN LOADING
			if (result.user != undefined && result.user != null){
				assign_user(result.user);
				$state.go('dashboard');
			}
		});
	}
}

$scope.init();

$scope.sendName = function(name){
	console.log('estamos enviado data '+name);
	//Envio string y me tiene que devolver un TOKEN

	$scope.user = {};
	$scope.user.nombre = 'Ezequiel Ramiro Browser';
	$scope.user.provider = 'Browser';
	$scope.user.email = name;
	$scope.user.photo = 'no hay';
	getToken.save({user: $scope.user}, function(result){
		$localStorage.userToken = result.token;
		$localStorage.user = $scope.user;
		$state.go('dashboard');

		//Salvar token a ngstorage
	},function(error){
		console.log('error'+error);
	})
}

$scope.fetchMsg = function(){
	fetchmessage.get({token: $localStorage.userToken},function(result){
		console.log('todo ok'+ result);
		$scope.pruebaToken = result.msg;
	},function(error){
		console.log('otro error');
		$scope.pruebaToken = 'fallo';
	})
}


$scope.facebookLogin = function(){

	firebase.auth().onAuthStateChanged(function(user){

		if(user){
			assign_user(user);

		}else{

		var isApp = !document.URL.startsWith('http');

		if (window.cordova && isApp) {
			//ES DESDE LA APLICACION
		    facebookConnectPlugin.login(['public_profile'], function(result) {
		        provider = firebase.auth.FacebookAuthProvider.credential(result.authResponse.accessToken);
		        firebase.auth().signInWithCredential(provider).then(function(authData) {
		            // User successfully logged in
		            assign_user(authData.user);
		            $state.go('dashboard');
		           
		        }).catch(function(error) {
		            // Login error

		        });
			    }, function(error) {
			        // Login error
			    });
		} else {

			//ES WINDOWS!
			var provider = new firebase.auth.FacebookAuthProvider();

			firebase.auth().signInWithRedirect(provider).catch(function(error) {
				console.log('error firebase');
			});
		}
	}	    			
	});
}//FIN LOGIN

function assign_user(authData){

	if (authData != undefined && authData != null){
		$scope.user = {};
	    $scope.user.nombre = authData.displayName;
	    $scope.user.email = authData.email;
	    $scope.user.photo = authData.photoURL;
	    $scope.user.provider = 'Facebook';
	    //$scope.user.tokenFacebook = provider.accessToken;

	    $localStorage.user = $scope.user;

	    //enviar a nodejs y traer token
	    getToken.save({user: $scope.user}, function(result){
			$localStorage.userToken = result.token;
			console.log(result.token);
			//Next page
		},function(error){
			console.log('error'+error);
		});
	}

}





}]);