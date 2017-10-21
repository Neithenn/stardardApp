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

	$scope.logout = function(){

		firebase.auth().signOut().then(function(){
			window.cookies.clear(function() {

   				 console.log('Cookies cleared!');
   				 $localStorage.user = undefined;
   				 $state.go('login');
			});
		})
		.catch(function(){

			console.log('no se pudo deslogear!');

		});
	}

}])