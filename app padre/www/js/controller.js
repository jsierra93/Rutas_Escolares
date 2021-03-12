angular.module('AppPadre.controllers', [])

.controller('LoginCtrl', function( $cordovaLocalNotification, BaseUrl, $ionicPlatform, $cordovaPush, $rootScope, $scope, $state, $ionicModal, $timeout, $ionicLoading, $ionicPopup, $http, $window, PeticionesServidor) {

var watchID;
$rootScope.baseUrl = BaseUrl;
$scope.DatosLogin = {};

if ($window.localStorage['usuarioActual']){
    validartoken();
    $rootScope.usuarioActual = $window.localStorage['usuarioActual'];
};

 $scope.ValidarToken = function () {
    validartoken();
 };

function validartoken() {
     $ionicLoading.show({
      template: 'Cargando...'
    });

    $http.get($rootScope.baseUrl + '/validarTokenBack').success(function(res) {

        $rootScope.usuarioActual = $window.localStorage['usuarioActual'];
        $rootScope.idUsuario =  $window.localStorage['usuarioActual'];
        $ionicLoading.hide();
        $state.go('app.monitor');
       
        }).error( function() {
          $ionicLoading.hide();
          $state.go('login');
         console.log('No logueado');
        });
  };

  $scope.Login = function (DatosLogin) {
    $ionicLoading.show({
      template: 'Cargando...'
    });
      DatosLogin.tipousuario='padre';
      PeticionesServidor.Login(DatosLogin, function(res) {          
         if ((res.type == true) && (res.data.length == 1))
             {    
             $ionicLoading.hide();
           //  $rootScope.usuarioActual = DatosLogin._id;
             $window.localStorage['usuarioActual'] = DatosLogin._id;
             $rootScope.usuarioActual = $window.localStorage['usuarioActual'];
             $window.localStorage['token'] = res.data[0].token;
              $state.go('app.monitor');  
             } else {

                if ((res.type == false) || (res.data.length == 0)) {
                   $ionicLoading.hide();
                   var alertPopup = $ionicPopup.alert({
                       title: 'Iniciar Sesión',
                       template: 'Usuario / Contraseña incorrecta!!'
                     });
                     alertPopup.then(function(res) {
                     });  
                }

                }
                 
            }, function() {
                console.warn('Opps Error desconocido!!');
            } );    
             $scope.DatosLogin = {};   
  };
})

/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
.controller('NotificacionCtrl', function($cordovaLocalNotification, $ionicPlatform, $cordovaPush, $rootScope, $scope, $state, $ionicModal, $timeout, $ionicLoading, $ionicPopup, $http, $window, PeticionesServidor) {


PeticionesServidor.obtenerTokenId($window.localStorage['usuarioActual'], function (res){
  console.log(res);
         var t = {
              _id : res._id,
              id_padre : res.id_padre,
              id_estudiante : res.id_estudiante,
              id_ruta : res.id_ruta,
              token : res.token
              };
            
          }, function (error) {
            alert(error);
          });


$ionicPlatform.ready(function() {
PeticionesServidor.obtenerTokenId($window.localStorage['usuarioActual'], function (res){
            var t = {
              _id : res._id,
              id_padre : res.id_padre,
              id_estudiante : res.id_estudiante,
              id_ruta : res.id_ruta,
              token : res.token
              };
          $window.localStorage['id_ruta'] = t.id_ruta;
          $rootScope.id_estudiante = res.id_estudiante;
            if (t.token == ""){
               Registrar();
            }else{
              $rootScope.token = res.token;
            }
           

          }, function (error) {
            alert(error);
          });
});

$rootScope.RegistrarToken = function (){
  Registrar();
};

$rootScope.ProbarNotificacion = function(){
  var Datos = {
    token: $rootScope.token
  };

  PeticionesServidor.prueba(Datos, function (res) {
   // alert(res);
  }, function(error) {
    
  });
  
};

$rootScope.EstablecerCoordenas = function(){

   navigator.geolocation.getCurrentPosition(function (position) {
     var temp = {
           latitud : position.coords.latitude,
           longitud : position.coords.longitude
        };

 console.log('estudiante'+$rootScope.id_estudiante);
  PeticionesServidor.obtenerEstudianteId($rootScope.id_estudiante, function(res) {
    res.latitud_hogar = temp.latitud;
    res.longitud_hogar = temp.longitud;

      PeticionesServidor.modificarEstudiante(res, function (r) {
        console.log('Se establecio nuevo hogar estudiante');
      }, function (e) {
        
      });
  }, function (error) {
    // body...
  });

   }, function(){
   }, { maximumAge : 30000, timeout: 30000, enableHighAccuracy: true } );
   

};

$rootScope.EliminarToken = function () {


          PeticionesServidor.obtenerTokenId($window.localStorage['usuarioActual'], function (res){
            var t = {
              _id : res._id,
              id_padre : res.id_padre,
              id_estudiante : res.id_estudiante,
              id_ruta : res.id_ruta,
              token : ""
              };

               $rootScope.token = "";

             PeticionesServidor.modificarTokenPadre(t, function (resp) {
              var alertPopup = $ionicPopup.alert({
                       title: 'Alerta',
                       template: 'El token ha sido eliminado satisfactoriamente.'
                     });
                     alertPopup.then(function(res) {
                     }); 
             }, function (err) {
               alert(err);
             });

          }, function (error) {
            alert(error);
          });
};


function Registrar(){
    var config = {
      "senderID":"498376534972",
    };

 $cordovaPush.register(config).then(function(result) {
            
            //alert("Registro correcto : " + result);

           // $cordovaToast.showShortCenter('Registrado para push notifications');
            $scope.registerDisabled=true;
        }, function (err) {
            alert("Error al registrar " + err)
        });

};



$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
           // alert('registration ID = ' + notification.regid);

          PeticionesServidor.obtenerTokenId($window.localStorage['usuarioActual'], function (res){
            var t = {
              _id : res._id,
              id_padre : res.id_padre,
              id_estudiante : res.id_estudiante,
              id_ruta : res.id_ruta,
              token : notification.regid
              };

               $rootScope.token = notification.regid;
               $rootScope.id_estudiante = res.id_estudiante;
                $rootScope.id_ruta = res.id_ruta;

             PeticionesServidor.modificarTokenPadre(t, function (resp) {
               var alertPopup = $ionicPopup.alert({
                       title: 'Alerta',
                       template: 'El dispositivo ha sido registrado para recibir notificaciones.'
                     });
                     alertPopup.then(function(res) {
                     }); 
             }, function (err) {
               alert(err);
             });

          }, function (error) {
            alert(error);
          });

           
          }
          break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          alert(notification.message);
          break;

        case 'error':
          alert('GCM error = ' + notification.msg);
          break;

        default:
          alert('An unknown GCM event has occurred');
          break;
      }
    });


 $scope.Salir = function () {
  
   var confirmPopup = $ionicPopup.confirm({
     title: 'Cerrar Sesión',
     template: 'Desea cerrar sesión en RUTAS ESCOLARES?'
   });
   confirmPopup.then(function(res) {
     if(res) {

      $window.localStorage.clear();
       console.log('Sesión cerrada');

          PeticionesServidor.obtenerTokenId($window.localStorage['usuarioActual'], function (res){
            var t = {
              _id : res._id,
              id_padre : res.id_padre,
              id_estudiante : res.id_estudiante,
              id_ruta : res.id_ruta,
              token : ""
              };

               $rootScope.token = "";

             PeticionesServidor.modificarTokenPadre(t, function (resp) {
               alert("Token Eliminado");
             }, function (err) {
               alert(err);
             });

          }, function (error) {
            alert(error);
          });

       $state.go('login');
     } else {
       console.log('Sesión no cerrada');
     }
   });
  };

})

/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


.controller('MonitorCtrl', function(socket, $scope, $window, $state, $ionicLoading, $ionicPopup, $http, $rootScope, PeticionesServidor) {

$scope.Check = {};

$scope.Check.valor = true;

$scope.VerUbicacion = function (){

if ($scope.Check.valor == true ){
    navigator.geolocation.getCurrentPosition(function (position) {
     $scope.lat = position.coords.latitude;
      $scope.lon = position.coords.longitude;
     CrearMarcadorPadre();

   }, function(){
   }, { maximumAge : 30000, timeout: 30000, enableHighAccuracy: true } );
}else{
  if( $scope.posActual ){
      $scope.posActual.setMap(null);
   }
}


};

$scope.MarcadoresPasajeros = [];
  $scope.lat = "8.7610521";
  $scope.lon = "-75.882442";


  socket.on('connect', function (){
    
  });

 socket.on('Bienvenido', function (data) {
        console.log(data.mensaje);
    });
  

    socket.on('finalizarRecorrido', function (data) { 
    //var f=new Date(); 
      //console.log('Actualizar: Latitud: '+data.lat+' Longitud : '+data.lon+ " Hora "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds());
   
    var temp= {
    _id : data.id_ruta,
     latitud_vehiculo:$scope.posTemp.latitud_vehiculo,
     longitud_vehiculo: $scope.posTemp.longitud_vehiculo,
     estado : "inactivo"
    };
console.log(temp);
    CrearMarcadorVehiculo(temp);
   
    });

    socket.on('actualizarCoordenadas', function (data) { 
    var f=new Date(); 
      console.log('Actualizar: Latitud: '+data.lat+' Longitud : '+data.lon+ " Hora "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds());
    
    $scope.posTemp = {
       latitud_vehiculo:data.lat,
       longitud_vehiculo: data.lon
   };

    var temp= {
    _id : data.id_ruta,
     latitud_vehiculo:data.lat,
     longitud_vehiculo: data.lon,
     estado : "activo"
    };

    CrearMarcadorVehiculo(temp);
   
    });

  $scope.IniciarMapa = function() {
  var tpos = {};

   navigator.geolocation.getCurrentPosition(function (position) {
     $scope.lat = position.coords.latitude;
      $scope.lon = position.coords.longitude;
     CrearMarcadorPadre();

   }, function(){
   }, { maximumAge : 30000, timeout: 30000, enableHighAccuracy: true } );
   

var myLatlng = new google.maps.LatLng($scope.lat, $scope.lon);
    
    var mapOptions = {
      center: myLatlng,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);

    $scope.map = map;

var datosToken = {};

PeticionesServidor.obtenerTokenId($window.localStorage['usuarioActual'], function (res){
         datosToken = {
              _id : res._id,
              id_padre : res.id_padre,
              id_estudiante : res.id_estudiante,
              id_ruta : res.id_ruta,
              token : res.token
              };
            
  var t = {};
    t._id = res.id_ruta;

  socket.emit('CambiarSala',{
     Ruta: t
    });

PeticionesServidor.obtenerEstudianteId(datosToken.id_estudiante, function(resEst) {
    CrearMarcadorHogar(resEst);
}, function (error) {
  // body...
});

PeticionesServidor.obtenerListaPasajeroId(datosToken.id_ruta, function(resRuta) {
    CrearMarcadorVehiculo(resRuta);
}, function (error) {
  // body...
});
   }, function (error) {
     alert(error);
});


};

 function CrearMarcadorPadre() {
 if( $scope.posActual ){
    $scope.posActual.setMap(null);
 }
    var Posicion = new google.maps.LatLng($scope.lat, $scope.lon);

    var marker = new google.maps.Marker({
      position: Posicion ,
      map: $scope.map,
      icon : "http://130.211.180.114/images/padre_mapa.png"
    });

var contenido = '<div class="infoWindowContent"><h2> Mi Posición</h2></div>';


var infowindow = new google.maps.InfoWindow({
    content: contenido
  });
  
  marker.addListener('click', function() {
    infowindow.open($scope.map, marker);
  });
    $scope.posActual = marker;
  };

 function CrearMarcadorHogar(info) {
 if( $scope.posHogar ){
    $scope.posHogar.setMap(null);
 }
    var Posicion = new google.maps.LatLng(info.latitud_hogar, info.longitud_hogar);

    var marker = new google.maps.Marker({
      position: Posicion ,
      map: $scope.map,
      icon : "http://130.211.180.114/images/home-azul.png"
    });

var contenido = '<div class="infoWindowContent"><h2>'+info._id+'</h2></div>';


var infowindow = new google.maps.InfoWindow({
    content: contenido
  });
  
  marker.addListener('click', function() {
    infowindow.open($scope.map, marker);
  });
    $scope.posHogar = marker;
  };


   function CrearMarcadorVehiculo(info) {
    var icono ;

 if( $scope.posVehiculo ){
    $scope.posVehiculo.setMap(null);
 };

 if (info.estado == "activo"){
  icono = "http://130.211.180.114/images/bus-verde.png";
 }else {
  icono = "http://130.211.180.114/images/bus-azul.png";
 }

    var Posicion = new google.maps.LatLng(info.latitud_vehiculo, info.longitud_vehiculo);

    var marker = new google.maps.Marker({
      position: Posicion ,
      map: $scope.map,
      icon : icono
    });

var contenido = '<div class="infoWindowContent"><h2>'+info._id+'</h2></div>';


var infowindow = new google.maps.InfoWindow({
    content: contenido
  });
  
  marker.addListener('click', function() {
    infowindow.open($scope.map, marker);
  });
   $scope.map.setCenter(Posicion,0);
    $scope.posVehiculo = marker;
  };
})

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

.controller('MiVehiculoCtrl',function($rootScope, BaseUrl, $ionicLoading, $scope, $state, $ionicModal, $timeout,  $ionicPopup, $http, $window, PeticionesServidor) {
   $ionicLoading.show({
      template: 'Cargando...'
    });

 $scope.Dvehiculo = {};
function CargarDatos() {

   $scope.Dvehiculo = {};
console.log($window.localStorage['id_ruta']);
 PeticionesServidor.obtenerVehiculoId($window.localStorage['id_ruta'], function(res) {
         $scope.Dvehiculo = res;
           $ionicLoading.hide();
    },
    function() {
      alert("Error al cargar la informacion del vehiculo");
    });  
};

CargarDatos();

})

//------------------------------------------------------------------------------------------------------------------------------------------------------------------

.controller('ConductorCtrl',function($rootScope, BaseUrl, $ionicLoading, $scope, $state, $ionicModal, $timeout,  $ionicPopup, $http, $window, PeticionesServidor) {
   $ionicLoading.show({
      template: 'Cargando...'
    });


CargarDatos();
 
function CargarDatos() {

   $scope.Dconductor = {};


 PeticionesServidor.obtenerListaPasajeroId($window.localStorage['id_ruta'], function(resLista) {

      PeticionesServidor.obtenerConductorId(resLista.id_conductor, function (resCond) {
         
           PeticionesServidor.obtenerPersonaId(resLista.id_conductor, function (resPer) {
              
                var temp = {
                  _id: resCond._id,
                  primer_nombre: resPer.primer_nombre,
                  segundo_nombre: resPer.segundo_nombre,
                  primer_apellido:  resPer.primer_apellido,
                  segundo_apellido:  resPer.segundo_apellido,
                  f_nacimiento : resPer.f_nacimiento,
                  f_expedicion_documento : resPer.f_expedicion_documento,
                  rh : resPer.rh,
                  telefono : resPer.telefono,
                  celular : resPer.celular,
                  foto : resPer.foto,
                  numero_licencia : resCond.numero_licencia,
                  f_expedicion_doc: resCond.f_expedicion_doc,
                  f_vencimiento_doc: resCond.f_vencimiento_doc,
                  organismo_expedidor : resCond.organismo_expedidor
                 };

                  $scope.Dconductor = temp;
                  console.log(temp);
                    $ionicLoading.hide();
           }, function () {
             alert("Error al cargar la informacion de la persona");
           });
        }, function () {
        alert("Error al cargar la informacion del conductor");
       });

  },function() {
      alert("Error al cargar la informacion de la lista de pasajeros");
  });  
  $ionicLoading.hide();
};
})

//------------------------------------------------------------------------------------------------------------------------------------------------------------------

.controller('MiPerfilCtrl',function($rootScope, BaseUrl, $ionicLoading, $scope, $state, $ionicModal, $timeout,  $ionicPopup, $http, $window, PeticionesServidor) {
   $ionicLoading.show({
      template: 'Cargando...'
    });


CargarDatos();
 
function CargarDatos() {

   $scope.Dpadre = {};


 

      PeticionesServidor.obtenerPadreId($window.localStorage['usuarioActual'], function (resPad) {
         
           PeticionesServidor.obtenerPersonaId($window.localStorage['usuarioActual'], function (resPer) {
                var temp = {
                  _id: resPad._id,
                  primer_nombre: resPer.primer_nombre,
                  segundo_nombre: resPer.segundo_nombre,
                  primer_apellido:  resPer.primer_apellido,
                  segundo_apellido:  resPer.segundo_apellido,
                  f_nacimiento : resPer.f_nacimiento,
                  f_expedicion_documento : resPer.f_expedicion_documento,
                  rh : resPer.rh,
                  telefono : resPer.telefono,
                  celular : resPer.celular,
                  foto : resPer.foto,
                  estudiantes: resPad.estudiantes,
                  ocupacion:  resPad.ocupacion,
                  direccion_trabajo:  resPad.direccion_trabajo,
                  telefono_trabajo:  resPad.telefono_trabajo,
                  email:  resPad.email
                 };

                  $scope.Dpadre = temp;
                  console.log(temp);
                    $ionicLoading.hide();
           }, function () {
             alert("Error al cargar la informacion de la persona");
           });
        }, function () {
        alert("Error al cargar la informacion del padre");
       });
  $ionicLoading.hide();
};

});