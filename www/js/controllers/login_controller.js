

app.controller('login_ctrl', ['$scope','statusConnection','LoginOrSigninNodejs', '$localStorage', '$state','$FCMPlugin','loading',
 function($scope,statusConnection, LoginOrSigninNodejs, $localStorage, $state,$FCMPlugin, loading){


$scope.init = function(){
	//obtengo un string de la api
	$scope.error = {};
	statusConnection.get(null, function(result){
		$scope.dataUser= result.prueba;
	},function(error){
		console.log('No hubo conectividad con la API'+error);
	});

	//AGARRO EL CALL BACK DE FIREBASE
	var isApp = !document.URL.startsWith('http');

	if (window.cordova && !isApp) {
		firebase.auth().getRedirectResult().then(function(result) {		  
			//TENGO QUE METER UN LOADING
			if (result.user != undefined && result.user != null){
				assign_user_and_move(result.user);
				
			}
		}).catch(function(error){

			switch(error.code){
		 	case 'auth/account-exists-with-different-credential':
			 	$scope.$apply(function(){
			  	 $scope.error.email_other_method = true;
			  });
			 	break;
			 default:
			 	$scope.$apply(function(){
			  	 $scope.error.unexpected_error = true;
			  });
			 	break;
		 	}
		});
	}
}

$scope.init();

$scope.LoginPassword = function(email, password){

	$scope.error = {};

	if ($scope.loginform.$valid){
		loading.showWait();
		//DEBERIA LOGEARME CON FIREBASE y CONSEGUIR TOKEN DE API
		firebase.auth().signInWithEmailAndPassword(email, password)
		.then(function(user){

			$scope.user = {};
			
			$scope.user.provider = 'Password';
			$scope.user.email = email;
			$scope.user.photo = 'no hay';	
			
			LoginOrSigninNodejs.save({user: $scope.user}, function(result){

				$scope.user.name = result.name;
				$localStorage.userToken = result.token;
				$localStorage.user = $scope.user;
				$localStorage.user.uid = result.uid;
				loading.hideWait();
				$state.go('dashboard');

				//Salvar token a ngstorage
			},function(error){
				loading.hideWait();
				console.log('error'+error);
			})
		})
		.catch(function(error) {
		  // Handle Errors here.
		  loading.hideWait();
		  switch(error.code){
		 	case 'auth/user-not-found':
			 	$scope.$apply(function(){
			  	 $scope.error.wrong_user= true;
			  });
			 	break;
			 default:
			 	$scope.$apply(function(){
			  	 $scope.error.unexpected_error = true;
			  });
			 	break;
		 	}
		});
		
	}
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
		            assign_user_and_move(authData.user);
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

function assign_user_and_move(authData){

	if (authData != undefined && authData != null){
		$scope.user = {};
	    $scope.user.nombre = authData.displayName;
	    $scope.user.email = authData.email;
	    $scope.user.photo = authData.photoURL;
	    $scope.user.provider = 'Facebook';
	    //$scope.user.tokenFacebook = provider.accessToken;

	    $localStorage.user = $scope.user;

	    //enviar a nodejs y traer token
	    LoginOrSigninNodejs.save({user: $scope.user}, function(result){
			$localStorage.userToken = result.token;
			$localStorage.user.uid = result.uid;
			console.log(result.token);
			$state.go('dashboard');
			//Next page
		},function(error){
			console.log('error'+error);
		});
	}

}


$scope.signin = function(){

	$state.go('signin');
}

$scope.resetPassword = function(){
	$state.go('reset');
}





}]);