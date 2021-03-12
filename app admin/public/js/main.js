var Proyecto = angular.module('Proyecto', ['ngMaterial','ngRoute']);

//app
Proyecto.config(function($routeProvider){

	$routeProvider

		.when('/login',{
			templateUrl: "views/login.html",
			controller:"homeCtrl"
		})
		.when('/logout',{
			templateUrl: "views/logout.html",
			controller:"homeCtrl"
		})
		.when('/me',{
			templateUrl: "views/me.html",
			controller:"meCtrl"
		})
		.otherwise({
			redirectTo:'/'
		});
});

//controllers
Proyecto.controller('cabeceraCtrl',function ($scope) {
	$scope.usuario = "jsierra";
});

Proyecto.controller('loginCtrl', function($scope){

function login(){
id = $scope.id  ;
	password = $scope.password;

	$scope.mensaje="id : "+id+" pass : "+password;
}
});

//service