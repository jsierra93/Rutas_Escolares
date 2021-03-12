// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('AppConductor', ['ngSanitize' ,'ionic','ngCordova', 'AppConductor.controllers', 'AppConductor.services', 'btford.socket-io'])

.run(function($ionicPlatform, $rootScope,  $ionicPopup, $cordovaNetwork) {
  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

 });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider


  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller : 'LoginCtrl'
  })

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'LoginCtrl'
  })

  .state('app.inicio', {
    url: '/inicio',
    views: {
      'menuContent': {
        templateUrl: 'templates/inicio.html',
        controller: 'MonitorCtrl'
      }
    }
  })
  .state('app.monitor', {
    url: '/monitor',
    views: {
      'menuContent': {
        templateUrl: 'templates/monitor.html',
        controller: 'MonitorCtrl'
      }
    }
  })

  .state('app.pasajeros', {
    url: '/pasajeros',
    views: {
      'menuContent': {
        templateUrl: 'templates/pasajeros.html',
        controller: 'PasajerosCtrl'
      }
    }
  })

  .state('app.mivehiculo', {
      url: '/mivehiculo',
      views: {
        'menuContent': {
          templateUrl: 'templates/mivehiculo.html',
          controller: 'MiVehiculoCtrl'
        }
      }
    })
    .state('app.miperfil', {
      url: '/miperfil',
      views: {
        'menuContent': {
          templateUrl: 'templates/miperfil.html',
          controller: 'MiPerfilCtrl'
        }
      }
    })

  .state('app.ajustes', {
    url: '/ajustes',
    views: {
      'menuContent': {
        templateUrl: 'templates/ajustes.html',
       // controller: 'PlaylistCtrl'
      }
    }
  })


  .state('app.ayuda', {
    url: '/ayuda',
    views: {
      'menuContent': {
        templateUrl: 'templates/reportar.html',
       controller: 'MonitorCtrl'
      }
    }
  })

  .state('app.acercade', {
    url: '/acercade',
    views: {
      'menuContent': {
        templateUrl: 'templates/acercade.html',
       // controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

$httpProvider.interceptors.push(['$q', '$window', function($q, $window) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($window.localStorage['token']) {
                       config.headers.Authorization = $window.localStorage['token'];
                       }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        //$stateProvider.state.go('login');
                    }
                    return $q.reject(response);
                }
            };
        }]);


});
