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