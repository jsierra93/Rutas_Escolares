'use strict';

/* Controllers */

var latitud,
    longitud, 
    coordenadas,
    token;

    
angular.module('Proyecto')


// CONTROLADOR AUTENTICACION Y FUNCIONALIDADES ADICIONALES 

.controller('HomeCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', function($rootScope, $scope, $location, $localStorage, Main, $timeout, $mdSidenav, $log, $mdUtil) {

      $scope.ObtenerTokenLogin = function() {
             if ($localStorage.token){
           window.location = "home.html#/rutas";   
      }
      };

      $scope.ValidarToken = function () {
    
        Main.validarTokenFront(function(res) {
             $rootScope.token = localStorage.getItem('token');
              $rootScope.usuarioActual = localStorage.getItem('usuario');
        
        }, function (error) {
          window.location ="index.html";
        });

      };

  /*    $scope.ObtenerTokenApp= function() {
                 if (!$localStorage.token){
                  if($rootScope.token == ""){
              window.location = "index.html";   
                  }     
          }
      };
*/

      $scope.signin = function() {
            var formData = {
              _id: $scope._id,
            clave: $scope.clave,
            tipousuario : 'administrador'
            }

            Main.signin(formData, function(res) {
                if (res.type == false) {
                    alert(res.data)    
                } else {
                  console.log(res.data[0]);
                    localStorage.setItem('token', res.data[0].token);
                    localStorage.setItem('usuario', res.data[0]._id);
                    $rootScope.token = localStorage.getItem('token');
                    $rootScope.usuarioActual = localStorage.getItem('usuario');
                 window.location = "home.html";   
                    
                }
            }, function() {
                $rootScope.error = 'Failed to signin';
            })
        };

        $scope.signup = function() {
            var formData = {
               _id: $scope._id,
                clave: $scope.clave,
                tipousuario: $scope.tipo_usuario
            }

            Main.save(formData, function(res) {
                if (res.type == false) {
                    alert(res.data)
                } else {
                    $localStorage.token = res.data.token;
                    window.location = "index.html"    
                }
            }, function() {
                $rootScope.error = 'Failed to signup';
            })
        };

        $scope.me = function() {
            Main.me(function(res) {
                $scope.myDetails = res;
                $scope.usuario = res;
                //$rootScope.usuario = $localStorage.usuario;
                }, function() {
                $rootScope.error = 'Failed to fetch details';
            })
        };

      
        $scope.logout = function() {

            Main.logout(function() {
               window.localStorage.clear();
                $rootScope.usuario = "";
                $rootScope.token = "";
                window.location = "index.html"
            }, function() {
                alert("Failed to logout!");
            });
            
        };
    
      $scope.BusquedaGlobal = function ($event) {
          $rootScope.buscador = $scope.Tbuscador;
       };

 
    }])

// ---------------------------------------------------------------------------------------------------------------


// CONTROLADOR PRUEBA OBTENER MIS DATOS

.controller('MeCtrl', ['$rootScope', '$scope', '$location', 'Main', function($rootScope, $scope, $location, Main) {

        Main.me(function(res) {
            $scope.myDetails = res;
        }, function() {
            $rootScope.error = 'Failed to fetch details';
        });

     $rootScope.LeerBuscar =  function(){
    
        $rootScope.buscador = $scope.Tbuscador;
        console.log($scope.Tbuscador);
      };

    }])

//-------------------------------------------------------------------------------------------------------------------------
// CONTROLADOR VISTA RUTAS Y RAIZ

.controller('RutasCtrl', ['$rootScope', '$scope', 'Main', '$mdDialog', function($rootScope, $scope, Main, $mdDialog ) {
 
 $rootScope.Opcionmenu = "MONITOR";
 // Funciones del socket
 var socket = io.connect('http://localhost:8080');

    socket.on('bienvenidoAdmin', function (data) {
        console.log(data.mensaje);
    });

    socket.on('iniciarRecorrido', function (data) {

      var alert = $mdDialog.alert({
        title: 'Atención',
        content: 'La ruta '+data.id_ruta+' ha iniciado su recorrido. \n Seleccione en la lista de rutas activas.',
        ok: 'Cerrar'
      });
      $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
        });

        LimpiarMapa();
         $scope.listaP = [];
         CargarRutas();
    });

    socket.on('actualizarCoordenadas', function (data) { 
    var f=new Date(); 
      console.log('Actualizar: Latitud: '+data.lat+' Longitud : '+data.lon+ " Hora "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds());
   
    var temp= {
    _id : $scope.RutaSel,
     latitud_vehiculo:data.lat,
     longitud_vehiculo: data.lon,
     estado :"activo"
    } 


   if ($scope.MarcadorVehiculo.length > 0 ){
    for (var i = 0; i < $scope.MarcadorVehiculo.length; i++) {
      $scope.MarcadorVehiculo[i].setMap(null);
    };
    
    console.log('Marcador Eliminado');
   }

      createMarker(temp, "vehiculo");     
    });

     socket.on('finalizarRecorrido', function (data) {
         var alert = $mdDialog.alert({
        title: 'Atención',
        content: 'La ruta '+data.id_ruta+' ha finalizado su recorrido. \n Seleccione en la lista de rutas inactivas. ',
        ok: 'Cerrar'
      });
      $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
          LimpiarMapa();
        $scope.listaP = [];
        CargarRutas();
        });
        LimpiarMapa();
        $scope.listaP = [];
        CargarRutas();
    });

socket.on('reportarFalla', function (data) {
         var alert = $mdDialog.alert({
        title: 'Alerta ruta : '+data.id_ruta,
        content: 'Mensaje : '+data.mensaje,
        ok: 'Cerrar'
      });
      $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
        });
    });

  $scope.Marcadores = [];

  CargarRutas();

  function CargarRutas() {
    Main.obtenerListaPasajeros(function(res) {
    $scope.listaP = res;
  }, 
  function() {
  })
  };

  function LimpiarMapa(){

     if ($scope.MarcadorVehiculo){
    for (var i = 0; i < $scope.MarcadorVehiculo.length; i++) {
      $scope.MarcadorVehiculo[i].setMap(null);
    };
   };

    for (var i = 0; i < $scope.Marcadores.length; i++) {
      $scope.Marcadores[i].setMap(null);
    };
    
    $scope.MarcadorVehiculo = [];
    $scope.Marcadores = [];
  };

  $scope.ActulizarMapa = function() {
    LimpiarMapa();
  };

  $scope.CargarMarcadores= function(ev, RutaSeleccionada) {

    $scope.RutaSel = RutaSeleccionada._id;
    LimpiarMapa();

  socket.emit('CambiarSala',{
     Ruta: RutaSeleccionada
    });

   var Pasajeros = RutaSeleccionada.estudiantes;
    var Estudiante = {};

      ev.preventDefault();
      google.maps.event.trigger(RutaSeleccionada, 'click');

      createMarker(RutaSeleccionada, "vehiculo");

  for (var i = 0; i < Pasajeros.length; i++) {
    Main.obtenerEstudianteId(Pasajeros[i], function (res) {
        createMarker(res, "pasajero");

    }, function (error) {
      // En caso de error
   });
  };

  };  // Fin CargarMarcadores

var i= 0;

    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(8.756984, -75.886013),
        mapTypeId: google.maps.MapTypeId.ROADMAP 
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);


    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (info, tipo_marcador){

      console.log(info);

      if (tipo_marcador == "pasajero"){
   if (info.estado == "activo"){
        var icono= '../images/home-verde.png';
    }else {
      var icono= '../images/home-azul.png';
    }

         var LatLng= new google.maps.LatLng(info.latitud_hogar, info.longitud_hogar);
         
      }else if (tipo_marcador == "vehiculo"){

         if (info.estado == "activo"){
        var icono= '../images/bus-verde.png';
    }else {
      var icono= '../images/bus-azul.png';
    }
       
        var LatLng= new google.maps.LatLng(info.latitud_vehiculo, info.longitud_vehiculo);
      }

       window.setTimeout(function() {
      
        var marker = new google.maps.Marker({
            //animation: google.maps.Animation.DROP,
            map: $scope.map,
            icon : icono,
            position: LatLng,//new google.maps.LatLng(info.latitud_hogar, info.longitud_hogar),
            title: info._id
        });

        if (tipo_marcador == "vehiculo"){
          $scope.MarcadorVehiculo.push(marker);
          $scope.map.setCenter(LatLng,0);
          marker.content = '<div class="infoWindowContent">Ubicación Actual</div>';
        }else{
          $scope.Marcadores.push(marker); 
          //marker.content = '<div class="infoWindowContent">'+ info.primer_nombre+' '+info.primer_apellido+' '+info.segundo_apellido+' </div>'; 
        marker.content = '<div class="infoWindowContent">'+info.direccion+'</div>';
        }
        
        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });
        
        }, 500);
    };  
    

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    var Ruta;
    var Estudiante = {};

    Main.obtenerListaPasajeroId(selectedMarker._id, function (res) {
      Ruta = res;

   console.log (Ruta);
    }, function (error) {
      // En caso de error
    });

    };

}])

// ---------------------------------------------------------------------------------------------------------------

.controller('GestionarRutasCtrl',['$scope', '$rootScope' ,'Main', '$mdDialog', function ($scope, $rootScope, Main, $mdDialog) {

$rootScope.Opcionmenu = "GESTIONAR RUTAS";
$scope.PasajerosT = [];

CargarRutas();

function CargarRutas(){

 Main.obtenerListaPasajeros(function(res) {
    $scope.listaRutas = res;
  }, 
  function(){
  });
};

 $scope.Nuevo = function(ev) {

    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/formularioRutas.html',
      targetEvent: ev,
    })
    .then(function(respuesta) {
    if (respuesta == 'cancelar') {
      // $scope.listaRutas = {};
      
          CargarRutas();
    }
}, function() {
     //alert('Se ha cancelado la operación');
    });
  };
  
$scope.VerPasajeros = function(ev, PasajerosRuta) {

  var Estudiantes = {};
  var Personas = {};
  var DatosEstudiantes = [];
  var Pasajeros = [];


  Estudiantes = Main.obtenerEstudiantes(function(res) {

    Estudiantes = res;

        Main.obtenerPersonas(function(res) {
           
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
                  asignado : Estudiantes[i].asignado,
                  direccion : Estudiantes[i].direccion,
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
      
          Pasajeros.push(DatosEstudiantes[j]);
          console.log(DatosEstudiantes[j]);
      }

  };
};

  $scope.Pasajeros = Pasajeros;


    $mdDialog.show({
      controller: DialogEditController,
      templateUrl: 'views/VerPasajeros.html',
      targetEvent: ev,
      locals : {
        seleccion : Pasajeros
      }
    })
    .then(function(respuesta) {
      
    }, function() {
    //  $scope.alert = 'Se ha cancelado la operación';
    });

  
      },
      function() {
        alert("Error al obtener personas");
      });

    },
    function() {
      alert("Error al obtener Estudiantes");
    });
};

$scope.CargarConductores = function () {

   $scope.Conductores = {};
  var temp = [];

Main.obtenerConductores(function(res) {

  for (var i = 0; i < res.length; i++) {
      if ( res[i].asignado == "false"){
          temp.push(res[i]);
      }

      $scope.conductores = temp;
  };

},function() {
      alert("Error al obtener Conductores");
});

if ($scope.Conductores.length == 0){
  alert('No hay Conductores disponibles');
}
};

$scope.CargarVehiculos = function () {
  $scope.Vehiculos = {};
  var temp = [];

Main.obtenerVehiculos(function(res) {

  for (var i = 0; i < res.length; i++) {
      if ( res[i].asignado == "false"){
          temp.push(res[i]);
      }
}
      $scope.vehiculos = temp;

},function() {
      alert("Error al obtener Vehiculos");
});

if ( temp.length == 0 ){
 console.warn('No hay Vehiculos disponibles');
}

};

// Cargar estudiantes disponibles para asignar a Nueva Ruta
$scope.CargarEstudiantes = function () {
  var Estudiantes = {};
  var Personas = {};
  var DatosEstudiantes = [];

  Estudiantes = Main.obtenerEstudiantes(function(res) {

    Estudiantes = res;

        Main.obtenerPersonas(function(res) {
           Personas = res;
           
           for (var i = 0; i < Estudiantes.length; i++) {
              for (var j = 0; j < Personas.length; j++) {
              if ((Estudiantes[i]._id == Personas[j]._id) && (Estudiantes[i].asignado == false )){
                 
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
                  asignado : Estudiantes[i].asignado
                 };

                  DatosEstudiantes.push(temp);
                  //manejar datos de DatosUsuario como un array en js y html

                  $scope.DatosUsuario = DatosEstudiantes;
            };
              };
           };
// Fin ciclos

      },
      function() {
        alert("Error al obtener personas");
      });

    },
    function() {
      alert("Error al obtener Estudiantes");
    });
  $scope.listaPasajeros = DatosEstudiantes;
    alert('seleccione los estudiantes que asignara a la nueva ruta');
};


// Cargar todos los estudiantes para dar opcion de editar
$scope.CargarEstudiantesTodos = function (EstudiantesRuta) {



  var Estudiantes = {};
  var Personas = {};
  var DatosEstudiantes = [];
  var Test = [];
  $scope.PasajerosT = [];
  Estudiantes = Main.obtenerEstudiantes(function(res) {

    Estudiantes = res;

        Main.obtenerPersonas(function(res) {
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
                 asignado : Estudiantes[i].asignado
                 };

                  DatosEstudiantes.push(temp);
                  //manejar datos de DatosUsuario como un array en js y html

               //   $scope.DatosUsuario = DatosEstudiantes;
            };
         };
        };
// Fin ciclos
  
   for (var i = 0; i < DatosEstudiantes.length; i++) {

      if (  DatosEstudiantes[i].asignado == false ){

          Test.push (DatosEstudiantes[i]);

      }else {

        for (var j = 0; j<EstudiantesRuta.length; j++){
          if ( EstudiantesRuta[j] == DatosEstudiantes[i]._id){
            Test.push (DatosEstudiantes[i]);
          }  
        }  
      }
  };



$scope.listaPasajerosEditar = Test;

      },
      function() {
        alert("Error al obtener personas");
      });

    },
    function() {
      alert("Error al obtener Estudiantes");
    });

    alert('Marque o desmarque los estudiantes que desea asignar o eliminar de la ruta..');
};

$scope.NuevaRuta  = {
  _id : '',
  id_vehiculo : '',
  id_conductor : '',
  estudiantes : $scope.Pasajeros,
  latitud_vehiculo: '',
  longitud_vehiculo : '',
  estado: "inactiva"
};

   $scope.Pasajeros= [];

$scope.AgregarPasajeroArray = function (estudiante) {

if (!$scope.capacidad){
  Main.obtenerVehiculoId($scope.NuevaRuta.id_vehiculo, function (res) {
    $scope.capacidad = res.pasajeros;
    if ($scope.Pasajeros.length < $scope.capacidad ){

    $scope.Pasajeros.push(estudiante);

      if ($scope.Pasajeros.length == $scope.capacidad){
          alert('Ha llegado a la capacidad maxima del vehiculo');

      };
  }else{
estudiante.asignado = true;
    alert('Ha llegado a la capacidad maxima del vehiculo');
  
  }
  
}, function (error) {
  
});
}else{

  if ($scope.Pasajeros.length < $scope.capacidad ){

      $scope.Pasajeros.push(estudiante);
    if ($scope.Pasajeros.length == $scope.capacidad){
          alert('Ha llegado a la capacidad maxima del vehiculo');
      }

  }else{
estudiante.asignado = true;
    alert('Ha llegado a la capacidad maxima del vehiculo');
    
  }
  

}

    
};


function ModificarEstudiantes(asig){
  for (var i = 0; i < $scope.Pasajeros.length; i++) {
      $scope.Pasajeros[i].asignado=asig;
    Main.modificarEstudiante($scope.Pasajeros[i], function() {
      
    }, function (error) {
      // body...
    }) ;
  };
};


$scope.GuardarRuta= function (NuevaRuta) {
  NuevaRuta._id = NuevaRuta.id_vehiculo;
  NuevaRuta.latitud_vehiculo = "8.755987";
  NuevaRuta.longitud_vehiculo = "-75.885515";
  NuevaRuta.estudiantes= $scope.Pasajeros;
  NuevaRuta.estado="inactiva";



  Main.agregarListaPasajeros(NuevaRuta, function(res) {
     ModificarEstudiantes(true);

    Main.obtenerVehiculoId(NuevaRuta.id_vehiculo, function (res) {
    res.asignado = "true";

    Main.modificarVehiculo(res, function (res) {
      
    }, function (error){

    });

Main.obtenerConductorId(NuevaRuta.id_conductor, function (res) {

    res.asignado = "true";

    Main.modificarConductor (res, function (res) {
      
    }, function (error){

    });
}, function (error) {
  
});

}, function (error) {
  
});


    alert('Se ha registrado la nueva ruta');
    LimpiarFormulario();
    CargarRutas();
    $scope.CargarVehiculos();
    $scope.Pasajeros= [];
  }, function (error) {
   
  });

};


$scope.PasajerosModificados =  function (Pmodificar){
  $scope.PasajerosT.push(Pmodificar);
};

$scope.ActualizarRuta = function (Ruta){

var temp = [], 
    modi = []; // estudiantes a modificar estado

      Ruta._id = Ruta.id_vehiculo;
      Ruta.id_vehiculo = Ruta.id_vehi;
      Ruta.id_conductor = Ruta.id_condu;
      Ruta.estudiantes = [];



      for (var i = 0; i < $scope.PasajerosT.length; i++) {
        for (var j= 0;j < $scope.listaPasajerosEditar.length;j++) {
            
            if ($scope.PasajerosT[i]._id == $scope.listaPasajerosEditar[j]._id ){
                $scope.listaPasajerosEditar[j] = $scope.PasajerosT[i];
                modi.push($scope.PasajerosT[i]);
            }
        };
      };

    
// Carga los asignados a la ruta
  for (var k = 0; k < $scope.listaPasajerosEditar.length; k++) {
      if ($scope.listaPasajerosEditar[k].asignado == true){
        Ruta.estudiantes.push($scope.listaPasajerosEditar[k]._id);
        // console.log( $scope.listaPasajerosEditar);
      }
  };


for (var l = 0; l < modi.length; l++) {

  Main.modificarEstudiante(modi[l], function() {
      
    }, function (error) {
      // body...
    });
};



  Main.modificarListaPasajero(Ruta, function() {
       alert("se ha actualizado exitosamente");
    }, function (error) {
      // body...
    });


};

$scope.Editar = function(ev, Ruta) {
$scope.pasajeros = [];
$scope.vehiculos = {};
$scope.conductores = {};
Ruta.conductores = {};
Ruta.vehiculos = {};

var Tvehi = [] , Tcond = []; 

// Cargar los vehiculos desocupados y el actual
Main.obtenerVehiculoId(Ruta.id_vehiculo, function (res ) {

Tvehi.push(res);  


Main.obtenerVehiculos( function (res ){
    var Temp = res;

for (var i = 0; i < Temp.length; i++) {
    
 if ( Temp[i].asignado == "false"){
      Tvehi.push ( Temp[i]);
  };
};

}, function (error){

});

Ruta.vehiculos = Tvehi;

}, function (error) {

});


//Cargar los conductores desocupados y el actual

  Main.obtenerConductorId(Ruta.id_conductor, function (res ) {

Tcond.push(res);  
  
Main.obtenerConductores( function ( res ) {
  var Temp = res;

for (var i = 0; i < Temp.length; i++) {
    
 if ( Temp[i].asignado == "false"){
     Tcond.push ( Temp[i]);
  };
};

}, function (error){

});

Ruta.conductores = Tcond;

}, function (error ) {

});


/*Cargar los estudiantes asignados y dar la opcion de seleccionar y deseleccionar 
cada uno de los asignados a la ruta y los que estan disponibles. (Listo)
              
Cambiar estados de los estudiantes y agregarlos a pasajeros y actualizar ruta.
Si se cambio de vehiculo, conductor o estudiante cambiar asignado a false.
*/

    $mdDialog.show({
      controller: DialogEditControllerRuta,
      templateUrl: 'views/formularioRutasEditar.html',
      targetEvent: ev,
      locals : {
        seleccion : Ruta,
        PasajerosT : $scope.PasajerosT
      }
    })
     .then(function(respuesta) {

      if (respuesta == "cancelar"){


      }else{
      

      
      }
  // Organizar objeto para modificar la base de datos con los nuevos datos.
  
    }, function() {
    //  $scope.alert = 'Se ha cancelado la operación';
    });

};

$scope.EliminarRuta = function(Ruta_Datos, PasajerosR) {
var Estudiante,
    Ruta = Ruta_Datos._id;

Main.obtenerEstudiantes( function (res) {
  Estudiante = res;
        //console.log(Estudiante);


  for (var i = 0; i < PasajerosR.length; i++) {
  for (var j = 0; j < Estudiante.length; j++) {

    if ( PasajerosR[i] == Estudiante[j]._id ){

      Estudiante[j].asignado = false;

      Main.modificarEstudiante(Estudiante[j], function() {
        
      }, function (error) {
        // body...
      });
    }
  };
};

}, function (error) {
  // body...
});

// Cambiar estado a vehiculo


Main.obtenerVehiculoId(Ruta_Datos.id_vehiculo, function (res) {
    res.asignado = "false";

    Main.modificarVehiculo(res, function (res) {
      
    }, function (error){

    });
}, function (error) {
  
});


Main.obtenerConductorId(Ruta_Datos.id_conductor, function (res) {

    res.asignado = "false";

    Main.modificarConductor (res, function (res) {
      
    }, function (error){

    });
}, function (error) {
  
});

 Main.eliminarListaPasajero(Ruta, function() {
  console.log( "Elimino correctamente");
  $scope.CargarConductores();
  $scope.CargarVehiculos();
  }, function (error) {
    // aqui se genera un error por que elimina dos veces el registro
    console.log( "Entro al error");
  });
console.log( "Ninguna de las dos");
  CargarRutas();

};

$scope.Limpiar = function () {
 LimpiarFormulario();
};

function LimpiarFormulario(){

  $scope.listaPasajeros = '';
  $scope.NuevaRuta = {},
  $scope.Pasajeros = [],
  $scope.vehiculos = '';
  $scope.conductores='';
  $scope.CargarVehiculos();
  $scope.CargarConductores();  
};

}])
// ---------------------------------------------------------------------------------------------------------------

//Controlador de usuarios.html y los formularios para agregar, editar y ver mas de cada usuario

  .controller('UsuariosCtrl', ['$scope', 'Main', '$location', '$mdDialog', function ($scope, Main, $location, $mdDialog) {

    cargarTabla();
 
function LeerBuscar($event){
        $rootScope.buscador = $scope.buscador;
        console.log($scope.buscador);
      };
      

 //Solucionar problema cuando se carga la tabla se ven todos los datos primero
 // CIFRAR LA CONTRASEÑA DE USUARIOS EN LA BASE DE DATOS Y EN LA VISTA 
    function cargarTabla() {
      //$scope.listaviews = {};

        Main.obtenerUsuarios(function(res) {
             $scope.listaviews = res;
        },
        function() {
          alert("Error al cargar lista");
        });
    };
    
// Metodo para Mostrar formulario Modal y guardar en la base de datos
    $scope.Nuevo = function(ev) {

    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/formularioUsuario.html',
      targetEvent: ev,
    })
    .then(function(respuesta) {
    if (respuesta == 'cancelar') {
        $scope.alert = 'Se ha cancelado la operación';
    }else
    {
        Main.save(respuesta, function(res) {
                if (res.type == false) {
                    alert(res.data)
                } else {
                    alert('registro exitoso');
                    $scope.alert = ' Nuevo ID:  "' + respuesta._id + '".';   
                    cargarTabla();
                }
            }, function() {
                $scope.alert = 'Se ha producido un erro al registrar.';
            })
    }
    }, function() {
      $scope.alert = 'Se ha cancelado la operación';
    });
  };

// Muestra ventana Modal con la información del usuario seleccionado


    $scope.VerMas = function(ev, usuario){


        var DatosUsuario = {};

        if (usuario.tipousuario == "administrador")
        {
           // alert('administrador');

        } else if(usuario.tipousuario == "padre")
        {
            Main.obtenerPadreId(usuario._id, function(res) {
                
                usuario = res;
                console.log(usuario);

            },
            function() {
               alert ('error');
            });


        }else {

           Main.obtenerConductorId(usuario._id, function(res) {
                
                usuario = res;
                console.log(usuario);

            },
            function() {
               alert ('error');
            });

        }

      $mdDialog.show({
      controller: DialogEditController,
      templateUrl: 'views/vermasUsuarios.html',
      targetEvent: ev,
      locals : {
        seleccion : usuario
      }
    })
    .then(function(respuesta) {
    if (!respuesta) {
        $scope.alert = 'Se ha cancelado la operación';
    }else
    {
        $scope.alert = 'Operacion Exitosa';
  
        if (respuesta.tipousuario == "padre"){

               window.location = "home.html#/padres";  
        } else 
        if (respuesta.tipousuario == "conductor"){

               window.location = "home.html#/conductores";  
        }
             
    }
    }, function() {
      $scope.alert = 'Se ha cancelado la operación';
    });

    };

// Muestra ventana modal con el formulario para modificar informacion del usuario seleccionado y actualiza registro en BD
    $scope.Editar = function(ev, usuario) {

    $mdDialog.show({
      controller: DialogEditController,
      templateUrl: 'views/formularioUsuarioEditar.html',
      targetEvent: ev,
      locals : {
        seleccion : usuario
      }
    })
    .then(function(respuesta) {
    if (respuesta == 'cancelar') {
        $scope.alert = 'Se ha cancelado la operación';
    }else
    {
              console.log('id'+respuesta._id);
        Main.modificarUsuario(respuesta, function(res) {
                if (res.type == false) {
                    alert(res.data)
                } else {
                    alert('Actualización exitoso');
                    cargarTabla();
                }
            }, function() {
                $scope.alert = 'Fallo la Actualización';
            })
    }
    }, function() {
      $scope.alert = 'Se ha cancelado la operación';
    });
  };

// Elimina registro seleccionado 
    $scope.Eliminar = function(usuario){
        Main.eliminarUsuario(usuario, function (res) {
             
            alert('registro eliminado ' + res);
        }, function(error) {
            alert(error);
           
        });
        cargarTabla();
    };

  }])


// ---------------------------------------------------------------------------------------------------------------

// CONTROLADOR VISTA PADRES
.controller('PadresCtrl', ['$scope', '$rootScope','Main', '$mdDialog', function( $scope, $rootScope,  Main, $mdDialog ) {
    
    $rootScope.Opcionmenu = "GESTIONAR PADRES";
ObtenerDatosCompletos();

function ObtenerDatosCompletos(){
    var Padres = {};
    var Personas = {};
    var DatosPadre = [];

   $scope.DatosUsuario = {};
 //    $scope.listaviews = {};

  Padres = Main.obtenerPadres(function(res) {

    Padres = res;

        Main.obtenerPersonas(function(res) {
           Personas = res;
           
           for (var i = 0; i < Padres.length; i++) {
              for (var j = 0; j < Personas.length; j++) {
                 if (Padres[i]._id == Personas[j]._id){
                 
                 var temp = {
                  _id: Padres[i]._id,
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
                  estudiantes: Padres[i].estudiantes,
                  ocupacion:  Padres[i].ocupacion,
                  direccion_trabajo:  Padres[i].direccion_trabajo,
                  telefono_trabajo:  Padres[i].telefono_trabajo,
                  email:  Padres[i].email
                 };

                  DatosPadre.push(temp);
                  //manejar datos de DatosUsuario como un array en js y html

                  $scope.DatosUsuario = DatosPadre;
                   
                 };
              };
           };
// Fin ciclos

      },
      function() {
        alert("Error al obtener personas");
      });

    },
    function() {
      alert("Error al obtener padres");
    });
  $scope.listaviews = DatosPadre;
};

$scope.CambiarFoto = function (){
    alert('cambiar foto');
};

$scope.VerMas = function (ev, datos) {
 

    $mdDialog.show({
      controller: DialogEditController,
      templateUrl: 'views/vermasPadres.html',
      targetEvent: ev,
      locals : {
        seleccion : datos
      }
    })
    .then(function(respuesta) {
      
    }, function() {
    //  $scope.alert = 'Se ha cancelado la operación';
    });

};

$scope.Editar = function (ev, datos) {

    $mdDialog.show({
      controller: DialogEditController,
      templateUrl: 'views/formularioPadresEditar.html',
      targetEvent: ev,
      locals : {
        seleccion : datos
      }
    })
    .then(function(respuesta) {
    if (respuesta == 'cancelar') {
       // alert ('Se ha cancelado la operación');
    }else
    {

      var TemPadre = {
                  _id: respuesta._id,
                  estudiantes: respuesta.estudiantes,
                  ocupacion:  respuesta.ocupacion,
                  direccion_trabajo:  respuesta.direccion_trabajo,
                  telefono_trabajo:  respuesta.telefono_trabajo,
                  email:  respuesta.email
      };

      var TemPersona = {
                  _id: respuesta._id,
                  primer_nombre: respuesta.primer_nombre,
                  segundo_nombre: respuesta.segundo_nombre,
                  primer_apellido:  respuesta.primer_apellido,
                  segundo_apellido:  respuesta.segundo_apellido,
                  f_nacimiento : respuesta.f_nacimiento,  // fechas en formato aaaa/mm/dd
                  f_expedicion_documento : respuesta.f_expedicion_documento,
                  rh : respuesta.rh,
                  telefono : respuesta.telefono,
                  celular : respuesta.celular,
                  foto : respuesta.foto
      };
    


      Main.modificarPadre(TemPadre , function (res) {
      // CallBack modificarPadre
         if (res.type == false) {

                  alert(res.data)
          
                } else {
          
                    alert('Padres: Actualización exitoso');
          
                }
      }, 
      function() {
      // Error ModificarPadre
      
      });

      Main.modificarPersona(TemPersona , function (res) {
      // CallBack modificarPersona
          if (res.type == false) {

                            alert(res.data)
                    
                          } else {
                    
                              alert('Persona : Actualización exitoso');
                    ObtenerDatosCompletos();
                          }      
      }, 
      function() {
      // Error ModificarPersona
      
      });
    }
    }, function() {
    //  $scope.alert = 'Se ha cancelado la operación';
    });


};

// Elimina registro de Padre y Persona seleccionada
$scope.Eliminar = function (datos) {
 
  Main.eliminarPadre(datos, function (res) {
    alert('se ha eliminado el Padre : '+ datos);
  },
  function () {
    // alert(' Error al eliminar el registro' + datos);
  });
  
   Main.eliminarPersona(datos, function (res) {
      //alert('se ha eliminado la Persona : '+ datos);
    },
    function () {
     //  alert(' Error al eliminar el registro' + datos);
    });
         ObtenerDatosCompletos();
};

$scope.Nuevo = function (ev) {

    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/formularioPadres.html',
      targetEvent: ev,
    })
    .then(function(respuesta) {
    if (respuesta == 'cancelar') {
        $scope.alert = 'Se ha cancelado la operación';
    }else
    {

      var TemPadre = {
                  _id: respuesta._id,
                  estudiantes: respuesta.estudiantes,
                  ocupacion:  respuesta.ocupacion,
                  direccion_trabajo:  respuesta.direccion_trabajo,
                  telefono_trabajo:  respuesta.telefono_trabajo,
                  email:  respuesta.email
      };

      var TemPersona = {
                  _id: respuesta._id,
                  primer_nombre: respuesta.primer_nombre,
                  segundo_nombre: respuesta.segundo_nombre,
                  primer_apellido:  respuesta.primer_apellido,
                  segundo_apellido:  respuesta.segundo_apellido,
                  f_nacimiento : respuesta.f_nacimiento,  // fechas en formato aaaa/mm/dd
                  f_expedicion_documento : respuesta.f_expedicion_documento,
                  rh : respuesta.rh,
                  telefono : respuesta.telefono,
                  celular : respuesta.celular,
                  foto : respuesta.foto
      };
  
    

        Main.agregarPersona(TemPersona, function (res) {
          
           if (res.type == false ){
              alert(res.data)
           }else{

              alert('Persona registrada exitosamente');
             
           }
        }, 
        function () {
          alert(' ha ocurrido un error al registrar Persona');
        });

         Main.agregarPadre( TemPadre, function (res) {
                if (res.type == false) {

                }else {
                  alert('Padre registrador exitosamente');
                   ObtenerDatosCompletos();
                };
              }, 
              function () {
               alert('ha ocurrido un error al registrar Padre');
              });

        Main.subirFoto(respuesta.foto, function(res){
          console.log(res);
        }, function(err){
          console.log(err);
        });

      }
    }, function() {
      $scope.alert = 'Se ha cancelado la operación';
    });

 ObtenerDatosCompletos();
};
 
  }])

// ---------------------------------------------------------------------------------------------------------------


// CONTROLADOR VISTA ESTUDIANTES
  .controller('EstudiantesCtrl', ['$scope', '$rootScope','Main', '$mdDialog', function( $scope,$rootScope, Main, $mdDialog ) {

$rootScope.Opcionmenu = "GESTIONAR ESTUDIANTES";

  ObtenerDatosCompletos();


function ObtenerDatosCompletos(){
    var Estudiantes = {};
    var Personas = {};
    var DatosEstudiantes = [];
   

 Main.obtenerEstudiantes(function(res) {

    Estudiantes = res;

        Main.obtenerPersonas(function(res) {
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
                  asignado : Estudiantes[i].asignado, 
                  estado : Estudiantes[i].estado,
                  direccion : Estudiantes[i].direccion
                 };

                  DatosEstudiantes.push(temp);
                  //manejar datos de DatosUsuario como un array en js y html

                  $scope.DatosUsuario = DatosEstudiantes;
                 };
              };
           };
// Fin ciclos

      },
      function() {
        alert("Error al obtener personas");
      });

    },
    function() {
      alert("Error al obtener Estudiantes");
    });
  $scope.listaviews = DatosEstudiantes;
};


$scope.VerMas = function (ev, datos) {
 

    $mdDialog.show({
      controller: DialogEditController,
      templateUrl: 'views/vermasEstudiantes.html',
      targetEvent: ev,
      locals : {
        seleccion : datos
      }
    })
    .then(function(respuesta) {
      
    }, function() {
    //  $scope.alert = 'Se ha cancelado la operación';
    });


};

$scope.Editar = function (ev, datos) {
  
    $mdDialog.show({
      controller: DialogEditController,
      templateUrl: 'views/formularioEstudiantesEditar.html',
      targetEvent: ev,
      locals : {
        seleccion : datos
      }
    })
    .then(function(respuesta) {
    if (respuesta == 'cancelar') {
        //alert ('Se ha cancelado la operación');
    }else
    {

    var TemEstudiante = {
                  _id: respuesta._id,
                  padres: respuesta.padres,
                  latitud_hogar:  respuesta.latitud_hogar,
                  longitud_hogar:  respuesta.longitud_hogar,
                  grado_cursado:  respuesta.grado_cursado,
                  grupo_cursado:  respuesta.grupo_cursado,
                  estado: respuesta.estado,
                  asignado: respuesta.asignado,
                  direccion :respuesta.direccion
      };
      var TemPersona = {
                  _id: respuesta._id,
                  primer_nombre: respuesta.primer_nombre,
                  segundo_nombre: respuesta.segundo_nombre,
                  primer_apellido:  respuesta.primer_apellido,
                  segundo_apellido:  respuesta.segundo_apellido,
                  f_nacimiento : respuesta.f_nacimiento,  // fechas en formato aaaa/mm/dd
                  f_expedicion_documento : respuesta.f_expedicion_documento,
                  rh : respuesta.rh,
                  telefono : respuesta.telefono,
                  celular : respuesta.celular,
                  foto : respuesta.foto
      };


      Main.obtenerTokenId(respuesta._id, function (res){

        var TemToken = {
          _id: respuesta.padres,
          id_padre: respuesta.padre,
          id_estudiante : respuesta._id,
          token: res.token,
          id_ruta: res.id_ruta
      };


Main.ModificarTokenEstudiante(TemToken , function (resp) {
      // CallBack modificarEstudiante
         if (res.type == false) {

                  alert(resp.data)
          
                } else {
          
                    alert('Token: Actualización exitoso');
          
                }
      }, 
      function() {
      // Error ModificarTpken
      
      });

      }, function (error){

      });


      Main.modificarEstudiante(TemEstudiante , function (res) {
      // CallBack modificarEstudiante
         if (res.type == false) {

                  alert(res.data)
          
                } else {
          
                    alert('Estudiante: Actualización exitoso');
          
                }
      }, 
      function() {
      // Error ModificarEstudiante
      
      });

      Main.modificarPersona(TemPersona , function (res) {
      // CallBack modificarPersona
          if (res.type == false) {

                            alert(res.data)
                    
                          } else {
                    
                              alert('Persona : Actualización exitoso');
                              ObtenerDatosCompletos();
                    
                          }      
      }, 
      function() {
      // Error ModificarPersona
      
      });

    }
    }, function() {
      $scope.alert = 'Se ha cancelado la operación';
    });
};

$scope.Eliminar = function (datos) {

  Main.eliminarEstudiante(datos, function(res) {
      //alert(' Registro Eliminado '+res);
  }, function () {
        //alert(' Error al eliminar el registro');
  });

Main.eliminarPersona(datos, function(res) {
      //alert(' Registro Eliminado '+res);
     
  }, function () {
       // alert(' Error al eliminar el registro');
  });


Main.eliminarToken(datos, function(res) {
      alert(res);
     
  }, function () {
       // alert(' Error al eliminar el registro');
  });
      ObtenerDatosCompletos();
};

$scope.Nuevo = function (ev) {
 
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/formularioEstudiantes.html',
      targetEvent: ev,
    })
    .then(function(respuesta) {
    if (respuesta == 'cancelar') {
        //$scope.alert = 'Se ha cancelado la operación';
    }else
    {

      var TemEstudiante = {
                  _id: respuesta._id,
                  padres: respuesta.padres,
                  latitud_hogar:  respuesta.latitud_hogar,
                  longitud_hogar:  respuesta.longitud_hogar,
                  grado_cursado:  respuesta.grado_cursado,
                  grupo_cursado:  respuesta.grupo_cursado,
                  asignado : false,
                  estado: "inactivo",
                  direccion : respuesta.direccion
      };

      var TemPersona = {
                  _id: respuesta._id,
                  primer_nombre: respuesta.primer_nombre,
                  segundo_nombre: respuesta.segundo_nombre,
                  primer_apellido:  respuesta.primer_apellido,
                  segundo_apellido:  respuesta.segundo_apellido,
                  f_nacimiento : respuesta.f_nacimiento,  // fechas en formato aaaa/mm/dd
                  f_expedicion_documento : respuesta.f_expedicion_documento,
                  rh : respuesta.rh,
                  telefono : respuesta.telefono,
                  celular : respuesta.celular,
                  foto : respuesta.foto
      };

      var TemToken = {
        _id : respuesta.padres,
        id_padre : respuesta.padres,
        id_estudiante:  respuesta._id,
        token :"",
        id_ruta : ""
      };
  

        Main.agregarPersona(TemPersona, function (res) {
          
           if (res.type == false ){
              alert(res.data)
           }else{

              alert('Persona registrada exitosamente');
             
           }
        }, 
        function () {
          alert(' ha ocurrido un error al registrar Persona');
        });

         Main.agregarEstudiante( TemEstudiante, function (res) {
                if (res.type == false) {

                }else {
                  alert('Estudiante registrador exitosamente');
                   ObtenerDatosCompletos();
                };
              }, 
              function () {
               alert('ha ocurrido un error al registrar Estudiante');
              });

          Main.agregarToken(TemToken,  function (res) {
          
           if (res.type == false ){
              alert(res.data)
           }else{

              alert('Token registrado exitosamente');
             
           }
        }, 
        function () {
          alert(' ha ocurrido un error al registrar Token');
        });

      }
    }, function() {
      $scope.alert = 'Se ha cancelado la operación';
    });
console.log("Se agrego estudiante");

 ObtenerDatosCompletos();
};
  }])

// ---------------------------------------------------------------------------------------------------------------

// CONTROLADOR VISTA CONDUCTORES

.controller('ConductoresCtrl', ['$scope', '$rootScope','Main', '$mdDialog', function( $scope,$rootScope, Main, $mdDialog ) {

$rootScope.Opcionmenu = "GESTIONAR CONDUCTORES";

ObtenerDatosCompletos();

// Funciona pero se repite aveces
function ObtenerDatosCompletos(){
    var Conductores = {};
    var Personas = {};
    var DatosConductor = [];
  $scope.DatosUsuario = {};
   $scope.listaviews = {};
  Conductores = Main.obtenerConductores(function(res) {

    Conductores = res;

        Main.obtenerPersonas(function(res) {
           Personas = res;
           
           for (var i = 0; i < Conductores.length; i++) {
              for (var j = 0; j < Personas.length; j++) {
                 if (Conductores[i]._id == Personas[j]._id){
                 
                 var temp = {
                  _id: Conductores[i]._id,
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
                  numero_licencia : Conductores[i].numero_licencia,
                  f_expedicion_doc: Conductores[i].f_expedicion_doc,
                  f_vencimiento_doc: Conductores[i].f_vencimiento_doc,
                  organismo_expedidor : Conductores[i].organismo_expedidor
                 };

                  DatosConductor.push(temp);
                  //manejar datos de DatosUsuario como un array en js y html

                  $scope.DatosUsuario = DatosConductor;
                 };
              };
           };
// Fin ciclos

      },
      function() {
        alert("Error al obtener personas");
      });

    },
    function() {
      alert("Error al obtener Estudiantes");
    });
  $scope.listaviews = DatosConductor;
};

//Pendiente
$scope.VerMas = function (ev, datos) {
  

    $mdDialog.show({
      controller: DialogEditController,
      templateUrl: 'views/vermasConductores.html',
      targetEvent: ev,
      locals : {
        seleccion : datos
      }
    })
    .then(function(respuesta) {
      
    }, function() {
    //  $scope.alert = 'Se ha cancelado la operación';
    });


};

//Funciona
$scope.Editar = function (ev, datos) {

  

    $mdDialog.show({
      controller: DialogEditController,
      templateUrl: 'views/formularioConductoresEditar.html',
      targetEvent: ev,
      locals : {
        seleccion : datos
      }
    })
    .then(function(respuesta) {
    if (respuesta == 'cancelar') {
        $scope.alert = 'Se ha cancelado la operación';
    }else
    {

      var TemConductor = {
                  _id: respuesta._id,
                   numero_licencia : respuesta.numero_licencia,
                  f_expedicion_doc: respuesta.f_expedicion_doc,
                  f_vencimiento_doc: respuesta.f_vencimiento_doc,
                  organismo_expedidor : respuesta.organismo_expedidor,
                  asignado : respuesta.asignado
      };

      var TemPersona = {
                  _id: respuesta._id,
                  primer_nombre: respuesta.primer_nombre,
                  segundo_nombre: respuesta.segundo_nombre,
                  primer_apellido:  respuesta.primer_apellido,
                  segundo_apellido:  respuesta.segundo_apellido,
                  f_nacimiento : respuesta.f_nacimiento,  // fechas en formato aaaa/mm/dd
                  f_expedicion_documento : respuesta.f_expedicion_documento,
                  rh : respuesta.rh,
                  telefono : respuesta.telefono,
                  celular : respuesta.celular,
                  foto : respuesta.foto
      };
  
    console.log(TemConductor);
    console.log(TemPersona);

        Main.modificarPersona(TemPersona, function (res) {
          
           if (res.type == false ){
              alert(res.data)
           }else{

              alert('Persona Modificada exitosamente');
             
           }
        }, 
        function () {
          alert(' ha ocurrido un error al Modificar Persona');
        });

         Main.modificarConductor( TemConductor, function (res) {
                if (res.type == false) {

                }else {
                  alert('Conductor Modificado exitosamente');
                   ObtenerDatosCompletos();
                };
              }, 
              function () {
               alert('ha ocurrido un error al Modificar Conductor');
              });

    }
    }, function() {
      $scope.alert = 'Se ha cancelado la operación';
    });

};

//Funciona

$scope.Eliminar = function (datos) {

  Main.eliminarConductor(datos, function(res) {

      alert('Persona registrada exitosamente');

  }, function () {
       // alert(' Error al eliminar Conductor');

  });

  Main.eliminarPersona(datos, function(res) {

    alert('Persona registrada exitosamente');

 //ObtenerDatosCompletos();

  
  }, function () {
       // alert(' Error al eliminar Persona');

  
  } );

  
  ObtenerDatosCompletos();

};

// Funciona
$scope.Nuevo = function (ev) {


    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/formularioConductores.html',
      targetEvent: ev,
    })
    .then(function(respuesta) {
    if (respuesta == 'cancelar') {
        $scope.alert = 'Se ha cancelado la operación';
    }else
    {

      var TemConductor = {
                  _id: respuesta._id,
                   numero_licencia : respuesta.numero_licencia,
                  f_expedicion_doc: respuesta.f_expedicion_doc,
                  f_vencimiento_doc: respuesta.f_vencimiento_doc,
                  organismo_expedidor : respuesta.organismo_expedidor,
                  asignado: "false"
      };

      var TemPersona = {
                  _id: respuesta._id,
                  primer_nombre: respuesta.primer_nombre,
                  segundo_nombre: respuesta.segundo_nombre,
                  primer_apellido:  respuesta.primer_apellido,
                  segundo_apellido:  respuesta.segundo_apellido,
                  f_nacimiento : respuesta.f_nacimiento,  // fechas en formato aaaa/mm/dd
                  f_expedicion_documento : respuesta.f_expedicion_documento,
                  rh : respuesta.rh,
                  telefono : respuesta.telefono,
                  celular : respuesta.celular,
                  foto : respuesta.foto
      };
  
    console.log(TemConductor);
    console.log(TemPersona);

        Main.agregarPersona(TemPersona, function (res) {
          
           if (res.type == false ){
              alert(res.data)
           }else{

              alert('Persona registrada exitosamente');
             
           }
        }, 
        function () {
          alert(' ha ocurrido un error al registrar Persona');
        });

         Main.agregarConductor( TemConductor, function (res) {
                if (res.type == false) {

                }else {
                  alert('Conductor registrador exitosamente');
                   ObtenerDatosCompletos();
                };
              }, 
              function () {
               alert('ha ocurrido un error al registrar Conductor');
              });

    }
    }, function() {
      $scope.alert = 'Se ha cancelado la operación';
    });
  };

  }])

// ---------------------------------------------------------------------------------------------------------------


// CONTROLADOR VISTA VEHICULOS

.controller('VehiculosCtrl', ['$rootScope','$scope', 'Main', '$mdDialog', function( $rootScope, $scope, Main, $mdDialog ) {

$rootScope.Opcionmenu = "GESTIONAR VEHICULOS";

function CargarDatos() {
   $scope.listaviews = {};
 Main.obtenerVehiculos(function(res) {
         $scope.listaviews = res;
    },
    function() {
      alert("Error al cargar lista");
    });  
};

CargarDatos();


$scope.Adjuntar = function (ev, datos){
    $mdDialog.show({
      controller: DialogEditController,
      templateUrl: 'views/adjuntarVehiculos.html',
      targetEvent: ev,
      locals : {
        seleccion : datos
      }
    })
      .then(function(respuesta) {
    if (respuesta == 'cancelar') {
        $scope.alert = 'Se ha cancelado la operación';
    }else
    {

        Main.modificarVehiculo(respuesta, function (res) {
          
           if (res.type == false ){
              alert(res.data)
           }else{

              alert('Vehiculo modificado exitosamente');
              CargarDatos();
           }
        }, 
        function () {
          alert(' ha ocurrido un error al modificar vehiculo');
        });

    }
    }, function() {
      $scope.alert = 'Se ha cancelado la operación';
    });
};

$scope.VerMas = function (ev, datos) {
  

    $mdDialog.show({
      controller: DialogEditController,
      templateUrl: 'views/vermasVehiculos.html',
      targetEvent: ev,
      locals : {
        seleccion : datos
      }
    })
    .then(function(respuesta) {
      
    }, function() {
    //  $scope.alert = 'Se ha cancelado la operación';
    });

};

$scope.Editar = function (ev, datos) {
 
    $mdDialog.show({
      controller: DialogEditController,
      templateUrl: 'views/formularioVehiculoEditar.html',
      targetEvent: ev,
       locals : {
        seleccion : datos
      }
    })
    .then(function(respuesta) {
    if (respuesta == 'cancelar') {
        $scope.alert = 'Se ha cancelado la operación';
    }else
    {

        Main.modificarVehiculo(respuesta, function (res) {
          
           if (res.type == false ){
              alert(res.data)
           }else{

              alert('Vehiculo modificado exitosamente');
              CargarDatos();
           }
        }, 
        function () {
          alert(' ha ocurrido un error al modificar vehiculo');
        });

    }
    }, function() {
      $scope.alert = 'Se ha cancelado la operación';
    });

};

$scope.Eliminar = function (datos) {

  Main.eliminarVehiculo(datos, function(res) {
      alert(' Vehiculo Eliminado ');
  }, function () {
       
  });
  CargarDatos();
  };

$scope.Nuevo = function (ev) {
 
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/formularioVehiculos.html',
      targetEvent: ev,
    })
    .then(function(respuesta) {
    if (respuesta == 'cancelar') {
        $scope.alert = 'Se ha cancelado la operación';
    }else
    {
        respuesta.asignado = "false";

        Main.agregarVehiculo(respuesta, function (res) {
          
           if (res.type == false ){
              alert(res.data)
           }else{

              alert('Vehiculo registrado exitosamente');
              CargarDatos();
           }
        }, 
        function () {
          alert(' ha ocurrido un error al registrar vehiculo');
        });

    }
    }, function() {
      $scope.alert = 'Se ha cancelado la operación';
    });

   
};

}])

// ---------------------------------------------------------------------------------------------------------------


// CONTROLADOR MENU LATERAL

  .controller('MenuCtrl', function ($scope, $timeout, $mdSidenav, $mdUtil, $log) {
    $scope.toggleLeft = buildToggler('left');

    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
              //  $log.debug("toggle " + navID + " is done");
              });
          },300);
      return debounceFn;
    }
  })

  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
         // $log.debug("close LEFT is done");
        });
    };
  })

  // ---------------------------------------------------------------------------------------------------------------

// FIN DE LOS CONTROLADORES

// ---------------------------------------------------------------------------------------------------------------

// FUNCIONES EXTRAS USADAS EN LOS CONTROLADORES

 function localizame(socket) {
    
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition( function (position) {
              var   pos = {
                  id_ruta : "Ruta 1",
                  lat : position.coords.latitude,
                  lon : position.coords.longitude
                 }

               socket.emit('iniciarRecorrido', pos);
            console.log('Datos enviados -->  Ruta :'+pos.id_ruta+'  Latitud : '+pos.lat+' longitud : '+pos.lon);

                },function () {
                  // body...
                },{
              enableHighAccuracy: true, 
              maximumAge        : 30000, 
              timeout           : 27000
            });
            }else{
                alert('Oops! Tu navegador no soporta geolocalización.!');
            }
    }
        

// fUNCION PARA CONTROLAR VENTANAS EMERGENTES SIN DATOS

function DialogController($scope, $mdDialog){

  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.respuesta = function(respuesta) {
    $mdDialog.hide(respuesta);
  };
}

// fUNCIONES PARA CONTROLAR VENTANAS EMERGENTES CON DATOS
function DialogEditController($scope, $mdDialog, seleccion){

    $scope.seleccion = seleccion;


$scope.Descargar = function(id){
};

  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.respuesta = function(respuesta) {
    $mdDialog.hide(respuesta);
  };
}

function DialogEditControllerRuta($scope, $mdDialog, seleccion, PasajerosT){

    $scope.seleccion = seleccion;
    $scope.PasajerosT = PasajerosT;


$scope.Descargar = function(id){
  alert('descargar');
  document.location = '../images/adjuntos/vehiculos/'+id+'/soat.jpg';
};

  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.respuesta = function(respuesta) {
    $mdDialog.hide(respuesta);
  };
}