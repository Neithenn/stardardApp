function getInfo($resource){
	var data = $resource('http://192.168.0.115:8081/normal');
	return data;
}

app.factory('getInfo', ['$resource', getInfo]);

function getToken($resource){
	var data = $resource('http://192.168.0.115:8081/api/authenticate');
	return data;
}

app.factory('getToken', ['$resource', getToken]);


function fetchmessage($resource){
	var data = $resource('http://192.168.0.115:8081/api/testToken');
	return data;
}
app.factory('fetchmessage', ['$resource', fetchmessage]);

function sendFCMToken($resource){
	var token = $resource('http://192.168.0.115:8081/api/setToken');
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

app.factory('getUsers', ['$resource', getUsers]);

	function getUsers($resource){
		var users = $resource('http://192.168.0.115:8081/api/getusers');
		return users;
	}

app.factory('getSavedChats', ['$resource', getSavedChats]);
	
	function getSavedChats($resource){
		var chats = $resource('http://192.168.0.115:8081/api/savedchats');
		return chats;
	}