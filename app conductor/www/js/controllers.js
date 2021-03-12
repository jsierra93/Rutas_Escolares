angular.module('AppConductor.controllers', [])

.controller('LoginCtrl', function($cordovaNetwork, $cordovaLocalNotification, BaseUrl, $ionicPlatform, $cordovaPush, $rootScope, $scope, $state, $ionicModal, $timeout, $ionicLoading, $ionicPopup, $http, $window, PeticionesServidor) {


if ($window.localStorage['usuarioActual']){
    Validartoken();
};


$window.localStorage['pasajeros'] = [];
//$rootScope.baseUrl = 'http://130.211.180.114:8080';
  $scope.DatosLogin = {};
$rootScope.baseUrl = BaseUrl;
$scope.ValidarToken = function() {
  Validartoken();
};

function Validartoken () {
     $ionicLoading.show({
      template: 'Cargando...'
    });

    $http.get(BaseUrl + '/validarTokenBack').success(function(res) {

        $rootScope.usuarioActual = $window.localStorage['usuarioActual'];
        $rootScope.idUsuario =  $window.localStorage['usuarioActual'];
        $rootScope.rutaActual = $window.localStorage['rutaActual'];

        PeticionesServidor.obtenerListaPasajeroConductor( $window.localStorage['usuarioActual'], function (resp) {

                               $window.localStorage['pasajeros'] = JSON.stringify(resp.estudiantes);
                               $rootScope.pasajeros = JSON.parse($window.localStorage['pasajeros']);
                               console.log(resp.estado);

                               if (resp.estado == "activo"){
                                $state.go('app.monitor');
                               }else {
                                  $state.go('app.inicio');
                               }
                                 
                         }, function (error) {
                           
                         });

        $ionicLoading.hide();
        
       
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
      DatosLogin.tipousuario='conductor';
      PeticionesServidor.Login(DatosLogin, function(res) {        
         if ((res.type == true) && (res.data.length == 1))
             {    

              console.log(res);

                               $window.localStorage['usuarioActual'] = res.data[0]._id;
                               $window.localStorage['token'] = res.data[0].token;
        
                         PeticionesServidor.obtenerListaPasajeroConductor( $window.localStorage['usuarioActual'], function (resp) {

                                 $window.localStorage['rutaActual'] = resp._id;
                                 $window.localStorage['pasajeros'] = JSON.stringify(resp.estudiantes);
                                 $rootScope.pasajeros = JSON.parse($window.localStorage['pasajeros']);
                                 $rootScope.rutaActual = $window.localStorage['rutaActual'];
                                 $rootScope.usuarioActual = $window.localStorage['usuarioActual'];
                                 $rootScope.idUsuario =  $window.localStorage['usuarioActual'];
                                 
                         }, function (error) {
                           
                         });
                        
                          $ionicLoading.hide();
                          $state.go('app.inicio');
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

      
            // $scope.DatosLogin = {};   
  };

  $scope.Salir = function () {
  
   var confirmPopup = $ionicPopup.confirm({
     title: 'Cerrar Sesión',
     template: 'Desea cerrar sesión en RUTAS ESCOLARES?'
   });
   confirmPopup.then(function(res) {
     if(res) {
      $window.localStorage.clear();
       console.log('Sesión cerrada');
       $state.go('login');
     } else {
       console.log('Sesión no cerrada');
     }
   });
  };

})

/*------------------------------------------------------------------------------------------------------------------------------------------*/

.controller('MonitorCtrl', function(socket, BaseUrl, $scope, $window, $state, $ionicLoading, $ionicPopup, $http, $rootScope, PeticionesServidor) {
 var watchID;
 var Pactivos = 0 ;
  $scope.MarcadoresPasajeros = [];
  $scope.lat = "8.7610521";
  $scope.lon = "-75.882442";

  socket.on('connect', function (){
    
  });

    socket.on('Bienvenido', function (data) {
        console.log(data.mensaje);
    });


    socket.on('actualizarCoordenadas', function (data) { 
    var f=new Date(); 
      console.log('Actualizar: Latitud: '+data.lat+' Longitud : '+data.lon+ "Hora "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds());
      $scope.lat=data.lat;
      $scope.lon= data.lon;
      CrearMarcadorVehiculo();

    });
 
$scope.EnviarReporte = function (dato) {
    $scope.TReporte = dato;
    //alert($scope.TReporte);
    var data = {
      mensaje: dato,
      id_ruta : $window.localStorage['rutaActual']
    };

  socket.emit('novedadRecorrido', data);
       var alertPopup = $ionicPopup.alert({
     title: 'Reportar Falla',
     template: 'Su reporte ha sido enviado al administrador, espere instrucciones.'
   });
   alertPopup.then(function(res) {
     document.getElementById("textarea-reporte").value = "";
    //$state.go('app.inicio');
   });
};

ObtenerPasajeros();

$scope.ActivarGPS = function() {
     
     var alertPopup = $ionicPopup.alert({
     title: 'GPS',
     template: 'Para el correcto funcionamiento active el GPS'
   });
   alertPopup.then(function(res) {
     
   });

};

$rootScope.RecorridoIniciado =  $window.localStorage['recorridoIniciado'] ;



      $scope.IniciarMapa = function() {

      var tpos = {};

       navigator.geolocation.getCurrentPosition(function (position) {
         $scope.lat = position.coords.latitude;
          $scope.lon = position.coords.longitude;


PeticionesServidor.obtenerListaPasajeroConductor( $window.localStorage['usuarioActual'], function (resp) {
                                resp.latitud_vehiculo= position.coords.latitude ;
                                resp.longitud_vehiculo = position.coords.longitude ;
                               PeticionesServidor.modificarListaPasajero(resp, function(res){
                                  console.log('se modifico la posicion de la ruta en la bd');
                               },
                               function (error) {
                                 // body...
                               });

                         }, function (error) {
                           
                         });

       socket.emit('iniciarRecorrido', {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          id_ruta : $window.localStorage['rutaActual']
        });

       socket.emit('actualizarCoordenadas', {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      id_ruta : $window.localStorage['rutaActual']
    });
       
         CrearMarcadorVehiculo();

       }, function(){
       }, { maximumAge : 15000, timeout: 15000, enableHighAccuracy: true } );
       

    var myLatlng = new google.maps.LatLng($scope.lat, $scope.lon);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP 
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        $scope.map = map;
        console.log('Iniciar recorrido');
};

  function CrearMarcadorVehiculo() {
 if( $scope.posActual ){
    $scope.posActual.setMap(null);
 }
    var Posicion = new google.maps.LatLng($scope.lat, $scope.lon);

    var marker = new google.maps.Marker({
      position: Posicion ,
      map: $scope.map,
      icon : "http://130.211.180.114/images/bus_mapa.png" 
    });


var contenido = '<div class="infoWindowContent"><h2>'+$window.localStorage['rutaActual']+'</h2>Ubicación Actual</div>';


var infowindow = new google.maps.InfoWindow({
    content: contenido
  });
  
  marker.addListener('click', function() {
    infowindow.open($scope.map, marker);
  });
  $scope.map.setCenter(Posicion,0);
    $scope.posActual = marker;
  };


function CrearMarcadorPasajero(info) {

    var Posicion = new google.maps.LatLng(info.latitud_hogar, info.longitud_hogar);
    var icono;

    if (info.estado == "activo"){
      icono = "http://130.211.180.114/images/home-verde.png";
    } else if(info.estado == "inactivo"){
 icono = "http://130.211.180.114/images/home-azul.png";
    }
    var marker = new google.maps.Marker({
      position: Posicion,
      map: $scope.map,
      icon : icono
      //animation: google.maps.Animation.BOUNCE
    });

    $scope.MarcadoresPasajeros.push(marker);


var contenido = '<div class="infoWindowContent"><h2>'+info._id+'</h2>'+info.direccion+'</div>';


    var infowindow = new google.maps.InfoWindow({
        content: contenido
      });
      
      marker.addListener('click', function() {
        infowindow.open($scope.map, marker);
      });
  };

function LimpiarMarcadores(){
  $scope.posActual.setMap(null);
  for (var i = 0; i < $scope.MarcadoresPasajeros.length; i++) {
    $scope.MarcadoresPasajeros[i].setMap(null);
  };
 }; 

window.setInterval( function () {
  if ($rootScope.RecorridoIniciado == "activo"){

   ObtenerCoordenadas();
   console.log('obteniendo cooordenadas.');
  }   
    }, 
    15000 //check every 59 seconds
);


function ObtenerCoordenadas() {
 
 var tpos = {};

   watchID = navigator.geolocation.watchPosition(function (position) {

     $scope.lat = position.coords.latitude;
      $scope.lon = position.coords.longitude;


PeticionesServidor.obtenerListaPasajeroConductor( $window.localStorage['usuarioActual'], function (resp) {
                                resp.latitud_vehiculo= position.coords.latitude ;
                                resp.longitud_vehiculo = position.coords.longitude ;
                               PeticionesServidor.modificarListaPasajero(resp, function(res){
                                  console.log('se modifico la posicion de la ruta en la bd');
                               },
                               function (error) {
                                 // body...
                               });

                         }, function (error) {
                           
                         });
  socket.emit('actualizarCoordenadas', {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      id_ruta : $window.localStorage['rutaActual']
    });
     CrearMarcadorVehiculo();
     console.log(tpos);

   }, function(){}, 
   { maximumAge : 15000, frequency : 5000, timeout: 30000, enableHighAccuracy: true } );
   
    window.setTimeout( function () {
            window.navigator.geolocation.clearWatch( watchID) 
        }, 
        5000 //stop checking after 20 seconds
    );


    //var watchID = navigator.geolocation.watchPosition(success, error, { maximumAge : 30000, timeout: 30000, enableHighAccuracy: true } );
    // navigator.geolocation.getCurrentPosition(success, error, { maximumAge : 30000, timeout: 30000, enableHighAccuracy: true } );
  };
  
$scope.EscanearId = function () {
 cordova.plugins.barcodeScanner.scan(
      function (result) {

        PeticionesServidor.obtenerEstudianteId(result.text, function (data) {
        
       
        if (data.estado == "inactivo")
        {
            data.estado="activo";

        }else if (data.estado == "activo"){

          data.estado = "inactivo";

        }else
        {
          alert("error:: sin estado");
        }
         
        
  Pactivos = 0;
  var temp ={
      _id: data._id,
      padres : data.padres,
      latitud_hogar: data.latitud_hogar,
      longitud_hogar: data.longitud_hogar,
      grado_cursado : data.grado_cursado,
      grupo_cursado : data.grupo_cursado,
      estado : data.estado,
      asignado : data.asignado,
      direccion: data.direccion
};

   PeticionesServidor.modificarEstudiante(temp, function (res){
      ObtenerPasajeros();
    },
    function (error){

    });

  

var casa;
if (data.estado == "inactivo"){
  var confirmPopup = $ionicPopup.confirm({
     title: 'Hogar',
     template: '¿Ha llegado el niño a su hogar?',
     cancelText :'No',
     okText:'Si',
   });
   confirmPopup.then(function(res) {
     if(res) {
        casa = true;
     } else {
       casa = false;
     }

PeticionesServidor.obtenerTokenId(data._id, function (ResTok) {
    if (ResTok.token == "")
    {
        alert('No se encuentra registrado padre para notificar');

    }else{
       ResTok.estado =  data.estado;
       ResTok.casa = casa;
   PeticionesServidor.notificarcambioestado(ResTok, function(r) {
      console.log(r);
   }, function (error) {
     // body...
   });
    }
     
   },function(ErrorT) {
     
   });


   });
 }else{
  PeticionesServidor.obtenerTokenId(data._id, function (ResTok) {
    if (ResTok.token == "")
    {
        alert('No se encuentra registrado padre para notificar');

    }else{
       ResTok.estado =  data.estado;
       ResTok.casa = casa;
   PeticionesServidor.notificarcambioestado(ResTok, function(r) {
      console.log(r);
   }, function (error) {
     // body...
   });
    }
     
   },function(ErrorT) {
     
   });
 }

       for (var i = 0; i < $scope.MarcadoresPasajeros.length; i++) {
        $scope.MarcadoresPasajeros[i].setMap(null);
      };


        }, function (error) {
          // Error...
        });
         /* alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);*/
      }, 
      function (error) {
          alert("Fallo el escaneo!!"+"\n"+"Por favor intente de forma manual");
      }
   );
};

$scope.IniciarRecorrido = function () {

 // $rootScope.RecorridoIniciado = "activo" ;
PeticionesServidor.obtenerListaPasajeroConductor( $window.localStorage['usuarioActual'], function (resp) {

                                resp.estado="activo";
                               PeticionesServidor.modificarListaPasajero(resp, function(res){
                                  
                               },
                               function (error) {
                                 // body...
                               });

                         }, function (error) {
                           
                         });
  

 $state.go('app.monitor');

var x = $window.localStorage['rutaActual'];

 PeticionesServidor.obtenerTokenRuta(x, function(res) {

 
 var postToken = [];

 for (var i = 0; i < res.length; i++) {
  if (res[i].token != ""){
   postToken.push(res[i].token);
  }
 };

 var data = {
  tokens : postToken
 };

  PeticionesServidor.notificarInicio(data, function (rest) {
    console.log(rest);
  }, function (error) {
    // body...
  });

 }, function(error) {
  
 });

 var pos = {
    lat : $scope.lat,
     lon : $scope.lon,
      id_ruta : $rootScope.rutaActual
   }

  socket.emit('iniciarRecorrido',   pos );

};

$scope.FinalizarRecorrido = function () {
  if (Pactivos>0)
  {
    var alertPopup = $ionicPopup.alert({
                       title: 'Pasajeros Activos',
                       template: 'No puede finalizar el recorrido! \n Aun tiene pasajeros activos'
                     });
                     alertPopup.then(function(res) {
                     });  

  } else {
//LimpiarMarcadores();
$rootScope.RecorridoIniciado = "inactivo" ;
window.navigator.geolocation.clearWatch(watchID) ;
 $state.go('app.inicio');

PeticionesServidor.obtenerListaPasajeroConductor( $window.localStorage['usuarioActual'], function (resp) {
                                resp.estado="inactivo";
                               PeticionesServidor.modificarListaPasajero(resp, function(res){
                                  
                               },
                               function (error) {
                                 // body...
                               });

                         }, function (error) {
                           
                         });
  
 socket.emit('finalizarRecorrido', 
  { id_ruta: $rootScope.rutaActual } 
  );


var x = $window.localStorage['rutaActual'];

 PeticionesServidor.obtenerTokenRuta(x, function(res) {

 
 var postToken = [];

 for (var i = 0; i < res.length; i++) {
  if (res[i].token != ""){
   postToken.push(res[i].token);
  }
 };

 var data = {
  tokens : postToken
 };

  PeticionesServidor.notificarFinalizar(data, function (rest) {
    console.log('notificarFinalizar: '+rest);
  }, function (error) {
    // body...
  });

 }, function(error) {
  
 });
 console.log('Finalizar recorrido');
/*
 $state.go('app.inicio');

    socket.emit('finalizarRecorrido', 
  { mensaje: 'Se ha finalizado el recorrido de la ruta xxxx' } 
  );
*/

  }
};

$scope.CambiarEstado= function (estado , data){
  Pactivos = 0;
  var temp ={
      _id: data._id,
      padres : data.padres,
      latitud_hogar: data.latitud_hogar,
      longitud_hogar: data.longitud_hogar,
      grado_cursado : data.grado_cursado,
      grupo_cursado : data.grupo_cursado,
      estado : estado,
      asignado : data.asignado,
      direccion: data.direccion
};

   PeticionesServidor.modificarEstudiante(temp, function (res){
      ObtenerPasajeros();
    },
    function (error){

    });

  

var casa;
if (estado == "inactivo"){
  var confirmPopup = $ionicPopup.confirm({
     title: 'Hogar',
     template: '¿Ha llegado el niño a su hogar?',
     cancelText :'No',
     okText:'Si',
   });
   confirmPopup.then(function(res) {
     if(res) {
        casa = true;
     } else {
       casa = false;
     }

PeticionesServidor.obtenerTokenId(data._id, function (ResTok) {
    if (ResTok.token == "")
    {
        alert('No se encuentra registrado padre para notificar');

    }else{
       ResTok.estado =  estado;
       ResTok.casa = casa;
   PeticionesServidor.notificarcambioestado(ResTok, function(r) {
      console.log(r);
   }, function (error) {
     // body...
   });
    }
     
   },function(ErrorT) {
     
   });


   });
 }else{
  PeticionesServidor.obtenerTokenId(data._id, function (ResTok) {
    if (ResTok.token == "")
    {
        alert('No se encuentra registrado padre para notificar');

    }else{
       ResTok.estado =  estado;
       ResTok.casa = casa;
   PeticionesServidor.notificarcambioestado(ResTok, function(r) {
      console.log(r);
   }, function (error) {
     // body...
   });
    }
     
   },function(ErrorT) {
     
   });
 }


   



   for (var i = 0; i < $scope.MarcadoresPasajeros.length; i++) {
    $scope.MarcadoresPasajeros[i].setMap(null);
  };
};


$scope.OcultarLista= function (){

}


function ObtenerPasajeros(){
  var Estudiantes = {};
  var Personas = {};
  var DatosEstudiantes = [];
  var Pasajeros = [];

PeticionesServidor.obtenerListaPasajeroConductor( $window.localStorage['usuarioActual'], function (resp) {
    var PasajerosRuta = resp.estudiantes;                     
    $window.localStorage['recorridoIniciado'] = resp.estado;
  PeticionesServidor.obtenerEstudiantes(function(res) {

    Estudiantes = res;

        PeticionesServidor.obtenerPersonas(function(res) {
           
           Personas = res;
           
           for (var i = 0; i < Estudiantes.length; i++) {
              for (var j = 0; j < Personas.length; j++) {
                 if (Estudiantes[i]._id == Personas[j]._id){
                 
                 var temp = {
                  _id: Estudiantes[i]._id,
                  primer_nombre: Personas[j].primer_nombre,
                  segundo_nombre: Personas[j].segundo_nombre,
                  primer_apellido:  Personas[j].primer_apellido,
                  segundo_apellido:  Personas[j].segundo_apellido,
                  f_nacimiento : Personas[j].f_nacimiento,
                  f_expedicion_documento : Personas[j].f_expedicion_documento,
                  rh : Personas[j].rh,
                  telefono : Personas[j].telefono,
                  celular : Personas[j].celular,
                  foto : Personas[j].foto,
                  padres : Estudiantes[i].padres[0],
                  latitud_hogar: Estudiantes[i].latitud_hogar,
                  longitud_hogar: Estudiantes[i].longitud_hogar,
                  grado_cursado : Estudiantes[i].grado_cursado,
                  grupo_cursado : Estudiantes[i].grupo_cursado,
                  estado : Estudiantes[i].estado,
                  direccion : Estudiantes[i].direccion
                 };

                  DatosEstudiantes.push(temp);
                  //manejar datos de DatosUsuario como un array en js y html
                 };
              };
           };
// Fin ciclos

        for (var i = 0; i < PasajerosRuta.length; i++) {

  for (var j = 0; j < DatosEstudiantes.length; j++) {

      if ( PasajerosRuta[i] ==  DatosEstudiantes[j]._id ){
        console.log(DatosEstudiantes[j]);
          Pasajeros.push(DatosEstudiantes[j]);
//Obtener id_padre, luego obtener documento token y agregar la ruta dentro del documento.
            
          if ( DatosEstudiantes[j].estado == "activo" ){
            Pactivos += 1;
          }
          CrearMarcadorPasajero(DatosEstudiantes[j]);


PeticionesServidor.obtenerTokenId(DatosEstudiantes[j]._id, function (response) {
    
    var t = {
        _id:  response._id,
        id_padre : response.id_padre,
        id_estudiante : response.id_estudiante,
        id_ruta: $rootScope.rutaActual,
        token : response.token
    }      

PeticionesServidor.modificarToken(t, function(r) {
    console.log('Modificacion correcta');
}, function (e) {
  
} );
  }, function (error) {
    
});
}

  };
};

  $rootScope.Pasajeros = Pasajeros;
  
      },
      function() {
        alert("Error al obtener personas");
      });

    },
    function() {
      alert("Error al obtener Estudiantes");
    });

                         }, function (error) {
                           
                         });

 
};


})

/*------------------------------------------------------------------------------------------------------------------------------------------*/

.controller('PasajerosCtrl', function($scope, $window, $state, $ionicLoading, $ionicPopup, $http, $rootScope, PeticionesServidor) {
   
  })
/*------------------------------------------------------------------------------------------------------------------------------------------*/
.controller('MiVehiculoCtrl', function($rootScope, BaseUrl, $ionicLoading, $scope, $state, $ionicModal, $timeout,  $ionicPopup, $http, $window, PeticionesServidor) {
   $ionicLoading.show({
      template: 'Cargando...'
    });

 $scope.Dvehiculo = {};
function CargarDatos() {

   $scope.Dvehiculo = {};

 PeticionesServidor.obtenerVehiculoId($window.localStorage['rutaActual'], function(res) {
          res.foto = "http://130.211.180.114/"+res.foto;
         $scope.Dvehiculo = res;
         console.log( $scope.Dvehiculo );
           $ionicLoading.hide();
    },
    function() {
      alert("Error al cargar la informacion del vehiculo");
    });  
};

CargarDatos();

})
/*------------------------------------------------------------------------------------------------------------------------------------------*/


.controller('MiPerfilCtrl', function($scope, $ionicLoading, BaseUrl, $window, $state, $ionicLoading, $ionicPopup, $http, $rootScope, PeticionesServidor) {
  

   $ionicLoading.show({
      template: 'Cargando...'
    });

    
ObtenerDatosCompletos();


function ObtenerDatosCompletos(){
    var Conductor = {};
    var Persona = {};
    var DatosConductor = [];

  $scope.DatosUsuario = {};
  $scope.Dconductor = {};

  PeticionesServidor.obtenerConductorId( $window.localStorage['usuarioActual'] , function(res) {
   
    Conductor = res;

        PeticionesServidor.obtenerPersonaId($window.localStorage['usuarioActual'], function(res) {
           Persona = res;
        
                 var temp = {
                  _id: Conductor._id,
                  primer_nombre: Persona.primer_nombre,
                  segundo_nombre: Persona.segundo_nombre,
                  primer_apellido:  Persona.primer_apellido,
                  segundo_apellido:  Persona.segundo_apellido,
                  f_nacimiento : Persona.f_nacimiento,
                  f_expedicion_documento : Persona.f_expedicion_documento,
                  rh : Persona.rh,
                  telefono : Persona.telefono,
                  celular : Persona.celular,
                  foto : "http://130.211.180.114/"+Persona.foto,
                  numero_licencia : Conductor.numero_licencia,
                  f_expedicion_doc: Conductor.f_expedicion_doc,
                  f_vencimiento_doc: Conductor.f_vencimiento_doc,
                  organismo_expedidor : Conductor.organismo_expedidor
                 };

                 $scope.Dconductor = temp;
                $ionicLoading.hide();
            },
      function() {
        alert("Error al obtener personas");
      });

    },
    function() {
      alert("Error al obtener Estudiantes");
    });

};

});
