function statusConnection($resource){
	//verifica conexion entre app y api
	var data = $resource('http://192.168.0.115:8081/normal');
	return data;
}

app.factory('statusConnection', ['$resource', 'API_URL', statusConnection]);

function LoginOrSigninNodejs($resource, API_URL){
	var token = $resource(API_URL+'authenticate');
	return token;
}

app.factory('LoginOrSigninNodejs', ['$resource','API_URL', LoginOrSigninNodejs]);


function sendFCMToken($resource, API_URL){
	var token = $resource(API_URL+'setToken');
	return token;
}

app.factory('sendFCMToken',['$resource',sendFCMToken]);

app.factory('$FCMPlugin', ['sendFCMToken', $FCMPlugin]);

        $FCMPlugin.$inject = [];

        function $FCMPlugin(sendFCMToken) {
           
            var service = {
                getToken: function(email) {
                    FCMPlugin.getToken(function(token){

                    		alert(token);
                    		if (token != undefined && token != null){
	                        	console.log(token);
	                        	sendFCMToken.save({email: email, token: token}, function(result){
	                        		console.log('token guardado');
	                        	}, function(error){
	                        		console.log('hubo un error al guardar el token');
	                        	})
	                        }else{
	                        	console.log('token null');
	                        }
                    	})
                    }
                }
            return service;            

          }

app.factory('getUsers', ['$resource', 'API_URL', getUsers]);

	function getUsers($resource, API_URL){
		var users = $resource(API_URL+'getusers');
		return users;
	}

app.factory('getSavedChats', ['$resource', 'API_URL', getSavedChats]);
	
	function getSavedChats($resource, API_URL){
		var chats = $resource(API_URL+'savedchats');
		return chats;
	}