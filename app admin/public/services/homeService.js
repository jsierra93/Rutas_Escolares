'use strict';
 
angular.module('Proyecto')
.factory('Main', ['$http', '$localStorage', function($http, $localStorage){
        var baseUrl = "http://localhost:8080";
        //var baseUrl = "http://localhost:8080";
        function changeUser(user) {
            angular.extend(currentUser, user);
        }
 
        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }
 
        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
               // user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }
 
        var currentUser = getUserFromToken();
 
        return {

            // Metodos HTTP para acceder a la API

            // Usuarios
            save: function(data, success, error) {
                $http.post(baseUrl + '/signup', data).success(success).error(error)
            },
            signin: function(data, success, error) {
                $http.post(baseUrl + '/login', data).success(success).error(error)
            },
            validarTokenFront: function(success, error) {
                $http.get(baseUrl + '/validarTokenBack').success(success).error(error)
            },
            me: function(success, error) {
                $http.get(baseUrl + '/me').success(success).error(error)
            },
            logout: function(success) {
                changeUser({});
                 window.localStorage.clear();
                success();
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

              agregarToken: function(data, success, error){
                $http.post(baseUrl + '/gcm' , data).success(success).error(error)
            },
             obtenerTokens: function(success, error){
                $http.get(baseUrl + '/gcm').success(success).error(error)
            },
             obtenerTokenId: function (data, success, error) {
                $http.get( baseUrl + '/gcm/'+ data).success(success).error(error)
            },
            ModificarTokenEstudiante: function (data, success, error) {
                $http.put(baseUrl + '/gcmestudiante/' + data.id_estudiante, data ).success(success).error(error)
            },
             ModificarTokenPadre: function (data, success, error) {
                $http.put(baseUrl + '/gcmpadre/' + data._id, data ).success(success).error(error)
            },
             eliminarToken: function (data, success, error) {
                $http.delete( baseUrl + '/gcm/' + data).success(success).error(error)
             },

             subirFoto: function(data, success, error){
                $http.post(baseUrl + '/subirFoto' , data).success(success).error(error)
            }
        };
    }
]);