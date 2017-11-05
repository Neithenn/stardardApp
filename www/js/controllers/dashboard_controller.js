app.controller('dashboard_ctrl', ['$scope','$localStorage','$state','$FCMPlugin',
 function($scope, $localStorage, $state, $FCMPlugin){

$scope.init = function(){
	if ($localStorage.user == undefined || $localStorage.user == null){

		$state.go('login');

	}else{

		$scope.user = {};
		$scope.user.nombre = $localStorage.user.nombre;
		$scope.user.email = $localStorage.user.email;
		$scope.user.photo = $localStorage.user.photo;
		$scope.user.provider = $localStorage.user.provider;
		$scope.userToken = $localStorage.userToken;
		$scope.user.uid = $localStorage.user.uid;

		//TOKEN PUSH NOTIFICATION

		$FCMPlugin.getToken($scope.user.email);

		//download url avatar from Firebase
		getUrlAvatarfromFirebase($scope.user.uid);
		
	}

	$scope.getPicturefromGallery = function(){

		cameraOptions = {
			destinationType: Camera.DestinationType.DATA_URL,
			correctOrientation: true,
			encodingType: Camera.EncodingType.JPEG,
  			sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
  			targetHeight: 200,
  			targetWidth: 200
  		}

  		navigator.camera.getPicture(function(image){
  			//var imagePicked = "data:image/jpeg;base64," + image;
  			var imagePicked = image;

  			//subir a Firebase!
  			var storageRef = firebase.storage().ref();
  			var uploadToFirebase = storageRef.child('avatar/'+$scope.user.uid);
  			uploadToFirebase.putString(imagePicked, 'base64').then(function(snapshot){
  				console.log('imagen subida!');
  				getUrlAvatarfromFirebase($scope.user.uid);

  			})
  			.catch(function(error){
  				console.log('hubo un error al subir la imagen');
  			});

  		}, function(error){
  			console.log('Error al traer la imagen '+error);
  			debugger;

  		}, cameraOptions);
	}


}
	function getUrlAvatarfromFirebase(name){
		
		var storage = firebase.storage();
		var pathReference = storage.ref('avatar/'+ name);

		pathReference.getDownloadURL().then(function(url){
				$scope.$apply(function(){
					$scope.userAvatar = url;
				});
				
		}).catch(function(error){
			console.log('no hay foto');
		})
		
	}

$scope.init();

	$scope.goToChat = function(){
		$state.go('users_list');		
	}

	$scope.logout = function(){

		firebase.auth().signOut().then(function(){
			window.cookies.clear(function() {

   				 console.log('Cookies cleared!');
   				 $localStorage.user = undefined;
   				 $state.go('login');
			});
		})
		.catch(function(){

			console.log('no se pudo deslogear de firebase!');
				

   				// console.log('Cookies cleared!');
   				 $localStorage.user = undefined;
   				 $state.go('login');
			

		});
	}



// Método ejecutado al hacer clic en el botón
	$scope.startCheckout = function(){
			var publicKey = "TEST-ad365c37-8012-4014-84f5-6c895b3f8e0a";
 			var prefId = "176234066-fc6d5d5e-2671-4073-ab49-362a98b720b5";
	   // Iniciar el checkout de MercadoPago
	  MercadoPago.startCheckout(publicKey, prefId, null, false, success, failure);

			  // Espera los resultados del checkout
		var success = function(payment) {
		    if (payment != null){
		        // Listo! El pago ya fue procesado por MP.
		        console.log(JSON.parse(payment).id);
		    } else {
		        alert ("El usuario no concretó el pago.");
		    }
		};
		var failure = function(error) {
		    // Error llamando a MercadoPago Plugin
		    console.log("Error MercadoPagoPlugin : " + error);
		};
	  
	}

}])