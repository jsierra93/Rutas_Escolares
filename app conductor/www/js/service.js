angular.module('AppConductor.services', [])

.factory('BaseUrl', function () {
var url = 'http://130.211.180.114:8080';
//var url = 'http://localhost:8080';
    return url;
})

.factory('socket',function(BaseUrl, socketFactory){

   
        //Create socket and connect to http://chat.socket.io 
         var myIoSocket = io.connect(BaseUrl);

          mySocket = socketFactory({
            ioSocket: myIoSocket
          });

        return mySocket;
    })

.factory('PeticionesServidor', function (BaseUrl , $http) {
	var baseUrl = BaseUrl;

	return {
      			Login : function(data, success, error) {
                      $http.post(baseUrl + '/login', data).success(success).error(error)
                   },
      			Logout :function () {
      	
      			},
            TokenPush : function(data, success, error) {
                $http.get(baseUrl + '/TokenPush/'+ data).success(success).error(error)
             },		
            validarTokenFront: function(success, error) {
                $http.get(baseUrl + '/validarTokenBack').success(success).error(error)
            },
            obtenerListaPasajeroConductor: function (data, success, error) {
                $http.get( baseUrl + '/listapasajerosConductor/'+ data).success(success).error(error)
            },
			     obtenerUsuarios: function(success, error){
                $http.get(baseUrl + '/usuarios').success(success).error(error)
            },
            obtenerUsuarioId: function (data, success, error) {
                $http.get( baseUrl + '/usuarios/'+ data).success(success).error(error)
            },
            modificarUsuario: function (data, success, error) {
                $http.put(baseUrl + '/usuarios/' + data._id, data ).success(success).error(error)
            },
            eliminarUsuario: function(data, success, error) {
               $http.delete(baseUrl + '/usuarios/'+ data).success(success).error(error)
            },

            // Estudiantes
            agregarEstudiante: function(data, success, error){
                $http.post(baseUrl + '/estudiantes' , data).success(success).error(error)
            },
             obtenerEstudiantes: function(success, error){
                $http.get(baseUrl + '/estudiantes').success(success).error(error)
            },
            obtenerEstudianteId: function (data, success, error) {
                $http.get( baseUrl + '/estudiantes/'+ data).success(success).error(error)
            },
            modificarEstudiante: function (data, success, error) {
                $http.put(baseUrl + '/estudiantes/' + data._id, data ).success(success).error(error)
            },
            eliminarEstudiante: function(data, success, error) {
               $http.delete(baseUrl + '/estudiantes/'+ data).success(success).error(error)
            },

            // Padres

            agregarPadre: function(data, success, error){
                $http.post(baseUrl + '/padres' , data).success(success).error(error)
            },
             obtenerPadres: function(success, error){
                $http.get(baseUrl + '/padres').success(success).error(error)
            },
             obtenerPadreId: function (data, success, error) {
                $http.get( baseUrl + '/padres/'+ data).success(success).error(error)
            },
            modificarPadre: function (data, success, error) {
                $http.put(baseUrl + '/padres/' + data._id, data ).success(success).error(error)
            },
             eliminarPadre: function (data, success, error) {
                $http.delete( baseUrl + '/padres/' + data).success(success).error(error)
             },

             // Vehiculos

            agregarVehiculo: function(data, success, error){
                $http.post(baseUrl + '/vehiculos' , data).success(success).error(error)
            },
             obtenerVehiculos: function(success, error){
                $http.get(baseUrl + '/vehiculos').success(success).error(error)
            },
             obtenerVehiculoId: function (data, success, error) {
                $http.get( baseUrl + '/vehiculos/'+ data).success(success).error(error)
            },
            modificarVehiculo: function (data, success, error) {
                $http.put(baseUrl + '/vehiculos/' + data._id, data ).success(success).error(error)
            },
             eliminarVehiculo: function (data, success, error) {
                $http.delete( baseUrl + '/vehiculos/' + data).success(success).error(error)
             },

            // Lista Pasajeros

            agregarListaPasajeros: function(data, success, error){
                $http.post(baseUrl + '/listapasajeros' , data).success(success).error(error)
            },
             obtenerListaPasajeros: function(success, error){
                $http.get(baseUrl + '/listapasajeros').success(success).error(error)
            },
             obtenerListaPasajeroId: function (data, success, error) {
                $http.get( baseUrl + '/listapasajeros/'+ data).success(success).error(error)
            },
            modificarListaPasajero: function (data, success, error) {
                $http.put(baseUrl + '/listapasajeros/' + data._id, data ).success(success).error(error)
            },
             eliminarListaPasajero: function (data, success, error) {
                $http.delete( baseUrl + '/listapasajeros/' + data).success(success).error(error)
             },

            // Conductores

            agregarConductor: function(data, success, error){
                $http.post(baseUrl + '/conductores' , data).success(success).error(error)
            },
             obtenerConductores: function(success, error){
                $http.get(baseUrl + '/conductores').success(success).error(error)
            },
             obtenerConductorId: function (data, success, error) {
                $http.get( baseUrl + '/conductores/'+ data).success(success).error(error)
            },
            modificarConductor: function (data, success, error) {
                $http.put(baseUrl + '/conductores/' + data._id, data ).success(success).error(error)
            },
             eliminarConductor: function (data, success, error) {
                $http.delete( baseUrl + '/conductores/' + data).success(success).error(error)
             },

             // Personas

            agregarPersona: function(data, success, error){
                $http.post(baseUrl + '/personas' , data).success(success).error(error)
            },
             obtenerPersonas: function(success, error){
                $http.get(baseUrl + '/personas').success(success).error(error)
            },
             obtenerPersonaId: function (data, success, error) {
                $http.get( baseUrl + '/personas/'+ data).success(success).error(error)
            },
            modificarPersona: function (data, success, error) {
                $http.put(baseUrl + '/personas/' + data._id, data ).success(success).error(error)
            },
             eliminarPersona: function (data, success, error) {
                $http.delete( baseUrl + '/personas/' + data).success(success).error(error)
             },
			CambiarEstadoRuta : function () {
				alert('CambiarEstadoRuta');
			},
            obtenerTokenId: function (data, success, error) {
                $http.get( baseUrl + '/gcm/'+ data).success(success).error(error)
            },
            modificarToken : function (data, success, error) {
                $http.put(baseUrl + '/gcmestudiante/' + data.id_estudiante, data ).success(success).error(error)
            },
            obtenerTokenRuta: function (data, success, error) {
                $http.get( baseUrl + '/gcmruta/'+ data).success(success).error(error)
            },
            notificarInicio: function(data, success, error){
                $http.post(baseUrl + '/notificarinicio' , data).success(success).error(error)
            },
            notificarcambioestado: function(data, success, error){
                $http.post(baseUrl + '/notificarcambioestado' , data).success(success).error(error)
            },
            notificarFinalizar: function(data, success, error){
                $http.post(baseUrl + '/notificarfinalizar' , data).success(success).error(error)
            },
            PushNotification : function(success, error) {
                $http.get(baseUrl+'/push').success(success).error(error)
            }
        };
});


