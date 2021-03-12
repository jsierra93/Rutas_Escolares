'use strict';

angular.module('Proyecto', [
    'ngStorage',
    'ngRoute',
    'ngMaterial'
])

.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

    $routeProvider.
        when('/', {
            templateUrl: 'views/rutas.html',
            controller: 'RutasCtrl'
        }).
        when('/signin', {
            templateUrl: 'views/signin.html',
            controller: 'HomeCtrl'
        }).
        when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'HomeCtrl'
        }).
        when('/me', {
            templateUrl: 'views/me.html',
            controller: 'HomeCtrl'
        }) .
        when('/gestionarRutas', {
            templateUrl: 'views/gestionarRutas.html',
            controller: 'GestionarRutasCtrl'
        }) .
        when('/usuarios', {
            templateUrl: 'views/usuarios.html',
            controller: 'UsuariosCtrl'
        }) .
        when('/padres', {
            templateUrl: 'views/padres.html',
            controller: 'PadresCtrl'
        }) .
        when('/estudiantes', {
            templateUrl: 'views/estudiantes.html',
            controller: 'EstudiantesCtrl'
        }) .
        when('/conductores', {
            templateUrl: 'views/conductor.html',
            controller: 'ConductoresCtrl'
        }) .
        when('/vehiculos', {
            templateUrl: 'views/vehiculos.html',
            controller: 'VehiculosCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if (localStorage.getItem('token')) {
                       config.headers.Authorization = localStorage.getItem('token');
                       }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/index.html');
                    }
                    return $q.reject(response);
                }
            };
        }]);

    }
]);