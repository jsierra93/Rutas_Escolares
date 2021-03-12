var app = angular.module('AppPadre', ['ionic','ngCordova', 'AppPadre.controllers', 'AppPadre.services','btford.socket-io']);

/*

app.config(['$ionicAppProvider', function($ionicAppProvider) {
  $ionicAppProvider.identify({
    app_id: '03f30524',
    api_key: '948ac8d2b34b896681112c33f58dff2781519ff6e5d39fa6',
    dev_push: true
  });
}])

*/
app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
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
    controller: 'NotificacionCtrl'
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

  .state('app.mivehiculo', {
      url: '/mivehiculo',
      views: {
        'menuContent': {
          templateUrl: 'templates/miruta.html',
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
.state('app.conductor', {
      url: '/conductor',
      views: {
        'menuContent': {
          templateUrl: 'templates/conductor.html',
          controller: 'ConductorCtrl'
        }
      }
    })

  .state('app.ajustes', {
    url: '/ajustes',
    views: {
      'menuContent': {
        templateUrl: 'templates/ajustes.html'
      }
    }
  })


  .state('app.ayuda', {
    url: '/ayuda',
    views: {
      'menuContent': {
        templateUrl: 'templates/ayuda.html'
      }
    }
  })

  .state('app.acercade', {
    url: '/acercade',
    views: {
      'menuContent': {
        templateUrl: 'templates/acercade.html'
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
