app.controller('signin_ctrl', ['$scope','$localStorage', '$state', 'LoginOrSigninNodejs','loading',
 function($scope, $localStorage, $state, LoginOrSigninNodejs, loading){

	$scope.error = {};
	$scope.error.email_taken = false;

	$scope.init = function(){
		//AGARRO EL CALL BACK DE FIREBASE
		var isApp = !document.URL.startsWith('http');
		
		if (window.cordova && !isApp) {
			firebase.auth().getRedirectResult().then(function(result) {		  
				//TENGO QUE METER UN LOADING
				if (result.user != undefined && result.user != null){
					assign_user_and_move(result.user);
					
				}
			});
		}
	}

	$scope.init();

	$scope.signinPassword = function(name ,email, password){
		

		if ($scope.signinform.$valid){

			loading.showWait();
			$scope.error = {};

			firebase.auth().createUserWithEmailAndPassword(email, password)
			.then(function(user){

				$scope.user = {};
				$scope.user.nombre = name;
				$scope.user.email = user.email;
				$scope.user.firebase_uid = user.uid;
				
				LoginOrSigninNodejs.save({user: $scope.user}, function(respond){
					//nodejs should sign in user and return UID and TOKEN.
					$localStorage.userToken = respond.token;
					$scope.user.uid = respond.uid;
					$localStorage.user = $scope.user;
					loading.hideWait();
					$state.go('dashboard');

				},function(error){
					console.log('error al registrarme en Nodejs');
					//aun por hacer
					$scope.error.email_taken = true;
					loading.hideWait();
				})


			})
			.catch(function(error) {
			 
				 switch(error.code){
				 	case 'auth/email-already-in-use':
					 	$scope.$apply(function(){
					  	 $scope.error.email_taken = true;
					  });
					 	break;
					 default:
					 	$scope.$apply(function(){
					  	 $scope.error.other_error = true;
					  });
					 	break;
				 }

			  	loading.hideWait();

			  
			  // ...
			});
		}
	}

	$scope.facebookLogin = function(){

	firebase.auth().onAuthStateChanged(function(user){

		if(user){
			assign_user_and_move(user);

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

	$scope.login = function(){
		$state.go('login');
	}



}])