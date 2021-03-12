angular.module('AppPadre.services', [])


.factory('BaseUrl', function () {
var url = 'http://130.211.180.114:8080';
 //var url = 'http://192.168.1.52:8080';
    return url;
})

.factory('socket',function(socketFactory){

 var baseUrl = 'http://130.211.180.114:8080';
 //var baseUrl = 'http://192.168.1.52:8080';
         var myIoSocket = io.connect(baseUrl);

          mySocket = socketFactory({
            ioSocket: myIoSocket
          });

        return mySocket;
    })

.factory('PeticionesServidor', function ($http) {
	var baseUrl = 'http://130.211.180.114:8080';
  //var baseUrl = 'http://192.168.1.52:8080';


	return {
			Login : function(data, success, error) {
                $http.post(baseUrl + '/login', data).success(success).error(error)
             },
			Logout :function () {
	
			       },
      obtenerPadreId: function (data, success, error) {
                $http.get( baseUrl + '/padres/'+ data).success(success).error(error)
            },
      obtenerTokenId: function (data, success, error) {
                $http.get( baseUrl + '/gcm/'+ data).success(success).error(error)
            },
      obtenerEstudianteId: function (data, success, error) {
                $http.get( baseUrl + '/estudiantes/'+ data).success(success).error(error)
            },
      obtenerListaPasajeroId: function (data, success, error) {
                $http.get( baseUrl + '/listapasajeros/'+ data).success(success).error(error)
            },
      modificarTokenPadre : function (data, success, error) {
                $http.put(baseUrl + '/gcmpadre/' + data._id, data ).success(success).error(error)
            },
      modificarEstudiante: function (data, success, error) {
                $http.put(baseUrl + '/estudiantes/' + data._id, data ).success(success).error(error)
            },
      modificarPadre: function (data, success, error) {
                $http.put(baseUrl + '/padres/' + data._id, data ).success(success).error(error)
            },
      TokenPush : function(data, success, error) {
              $http.get(baseUrl + '/TokenPush/'+ data).success(success).error(error)
             },		
      eliminarToken: function(data, success, error) {
               $http.delete(baseUrl + '/gcm/'+ data).success(success).error(error)
            },
      validarTokenFront: function(success, error) {
                $http.get(baseUrl + '/validarTokenBack').success(success).error(error)
            },
      prueba: function(data, success, error) {
                $http.post(baseUrl + '/prueba', data).success(success).error(error)
            },
      obtenerVehiculoId: function (data, success, error) {
                $http.get( baseUrl + '/vehiculos/'+ data).success(success).error(error)
            },
     obtenerConductorId: function (data, success, error) {
                $http.get( baseUrl + '/conductores/'+ data).success(success).error(error)
            },
    obtenerPersonaId: function (data, success, error) {
                $http.get( baseUrl + '/personas/'+ data).success(success).error(error)
    },
     obtenerPadreId: function (data, success, error) {
                $http.get( baseUrl + '/padres/'+ data).success(success).error(error)
    }
		};
});