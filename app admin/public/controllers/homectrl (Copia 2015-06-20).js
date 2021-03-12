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
            clave: $scope.clave
            }

            Main.signin(formData, function(res) {
                if (res.type == false) {
                    alert(res.data)    
                } else {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('usuario', res.data._id);
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

      $scope.BusquedaGlobal = function () {
          alert("Opción para realizar una busqueda dentro de la App!!");
      };

      $scope.Enter = function (e){
         if (e.which === 13)
          $scope.signin();
        };
    }])

// ---------------------------------------------------------------------------------------------------------------


// CONTROLADOR PRUEBA OBTENER MIS DATOS

.controller('MeCtrl', ['$rootScope', '$scope', '$location', 'Main', function($rootScope, $scope, $location, Main) {

        Main.me(function(res) {
            $scope.myDetails = res;
        }, function() {
            $rootScope.error = 'Failed to fetch details';
        })
}])

//-------------------------------------------------------------------------------------------------------------------------
// CONTROLADOR VISTA RUTAS Y RAIZ

.controller('RutasCtrl', ['$rootScope', '$scope', 'Main', function($rootScope, $scope, Main ) {
 
 // Funciones del socket
 var socket = io.connect();

    socket.on('bienvenidoAdmin', function (data) {
        console.log(data.mensaje);
    });

    socket.on('iniciarRecorrido', function (req) {
      
    localizame(socket);

    });

    socket.on('actualizarCoordenadas', function (req) {

      // recibe los datos de la ruta coordenada/ Id y se modifica la ruta.
      Main.modificarListaPasajeros(req, function (res){

      }, function (error){

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
    for (var i = 0; i < $scope.Marcadores.length; i++) {
      $scope.Marcadores[i].setMap(null);
    };
    $scope.Marcadores = [];
  };

  $scope.ActulizarMapa = function() {
    LimpiarMapa();
  };

  $scope.CargarMarcadores= function(ev, RutaSeleccionada) {

    LimpiarMapa();
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
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);


    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (info, tipo_marcador){

      if (tipo_marcador == "pasajero"){

         var LatLng= new google.maps.LatLng(info.latitud_hogar, info.longitud_hogar);
         var icono= '../images/home_mapa2.png';
      }else if (tipo_marcador == "vehiculo"){
       
        var LatLng= new google.maps.LatLng(info.latitud_vehiculo, info.longitud_vehiculo);
         var icono= '../images/bus_mapa3.png';
      }

       window.setTimeout(function() {
      
        var marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            map: $scope.map,
            icon : icono,
            position: LatLng,//new google.maps.LatLng(info.latitud_hogar, info.longitud_hogar),
            title: info._id
        });

         $scope.Marcadores.push(marker);
         console.log($scope.Marcadores);
        marker.content = '<div class="infoWindowContent">' + '<img src="http://maps.googleapis.com/maps/api/streetview?size=100x60&location=' + info.latitud_hogar + ',%20' + info.longitud_hogar + '&fov=90&heading=235&pitch=10&sensor=false" />'  + '</div>';
        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });
        
        }, 500);
    }  
    

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

    }

}])

// ---------------------------------------------------------------------------------------------------------------

.controller('GestionarRutasCtrl',['$scope', 'Main', '$mdDialog', function ($scope, Main, $mdDialog) {

//CargarRutas();

function CargarRutas(){

  $scope.listaRutas = {};

  Main.obtenerListaPasajeros(function(res) {
   
    $scope.listaRutas = res;
  }, 
  function() {
  })
};

 $scope.Nuevo = function(ev) {

    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/formularioRutas.html',
      targetEvent: ev,
    })
    .then(function(respuesta) {
    if (respuesta == 'cancelar') {
        $scope.alert = 'Se ha cancelado la operación';
      
    }else
    {

    }
    CargarRutas();
    }, function() {
      $scope.alert = 'Se ha cancelado la operación';
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
                  grupo_cursado : Estudiantes[i].grupo_cursado
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
              if ((Estudiantes[i]._id == Personas[j]._id) && (Estudiantes[i].asignado == "false")){
                 
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
                  grupo_cursado : Estudiantes[i].grupo_cursado
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
    $scope.Pasajeros.push(estudiante);   
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
  NuevaRuta.estudiantes= $scope.Pasajeros;
  NuevaRuta.estado="inactiva";

 

  Main.agregarListaPasajeros(NuevaRuta, function(res) {
     ModificarEstudiantes("true");

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


$scope.EditarRuta = function(){

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

      Estudiante[j].asignado = "false";

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
    alert('Se ha eliminado correctamente la ruta');
 
  $scope.CargarConductores();
  $scope.CargarVehiculos();
  }, function (error) {
    // aqui se genera un error por que elimina dos veces el registro
  });

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
 

 //Solucionar problema cuando se carga la tabla se ven todos los datos primero
 // CIFRAR LA CONTRASEÑA DE USUARIOS EN LA BASE DE DATOS Y EN LA VISTA 
    function cargarTabla() {
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
            alert('administrador');

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
.controller('PadresCtrl', ['$scope', 'Main', '$mdDialog', function( $scope, Main, $mdDialog ) {
    
ObtenerDatosCompletos();

function ObtenerDatosCompletos(){
    var Padres = {};
    var Personas = {};
    var DatosPadre = [];

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
        alert ('Se ha cancelado la operación');
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
       alert(' Error al eliminar el registro' + datos);
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
  
    console.log(TemPadre);
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

      }
    }, function() {
      $scope.alert = 'Se ha cancelado la operación';
    });

 ObtenerDatosCompletos();
};
 
  }])

// ---------------------------------------------------------------------------------------------------------------


// CONTROLADOR VISTA ESTUDIANTES
  .controller('EstudiantesCtrl', ['$scope', 'Main', '$mdDialog', function( $scope, Main, $mdDialog ) {

  ObtenerDatosCompletos();


function ObtenerDatosCompletos(){
    var Estudiantes = {};
    var Personas = {};
    var DatosEstudiantes = [];

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
                  grupo_cursado : Estudiantes[i].grupo_cursado
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
        alert ('Se ha cancelado la operación');
    }else
    {

    var TemEstudiante = {
                  _id: respuesta._id,
                  padres: respuesta.padres,
                  latitud_hogar:  respuesta.latitud_hogar,
                  longitud_hogar:  respuesta.longitud_hogar,
                  grado_cursado:  respuesta.grado_cursado,
                  grupo_cursado:  respuesta.grupo_cursado
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
      alert(' Registro Eliminado '+res);
  }, function () {
        //alert(' Error al eliminar el registro');
  });

Main.eliminarPersona(datos, function(res) {
      alert(' Registro Eliminado '+res);
     
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
        $scope.alert = 'Se ha cancelado la operación';
    }else
    {

      var TemEstudiante = {
                  _id: respuesta._id,
                  padres: respuesta.padres,
                  latitud_hogar:  respuesta.latitud_hogar,
                  longitud_hogar:  respuesta.longitud_hogar,
                  grado_cursado:  respuesta.grado_cursado,
                  grupo_cursado:  respuesta.grupo_cursado
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
  
    console.log(TemEstudiante);
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
      }
    }, function() {
      $scope.alert = 'Se ha cancelado la operación';
    });

 ObtenerDatosCompletos();
};
  }])

// ---------------------------------------------------------------------------------------------------------------

// CONTROLADOR VISTA CONDUCTORES

.controller('ConductoresCtrl', ['$scope', 'Main', '$mdDialog', function( $scope, Main, $mdDialog ) {

ObtenerDatosCompletos();

// Funciona pero se repite aveces
function ObtenerDatosCompletos(){
    var Conductores = {};
    var Personas = {};
    var DatosConductor = [];

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
                  organismo_expedidor : respuesta.organismo_expedidor
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

 ObtenerDatosCompletos();

  
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
                  organismo_expedidor : respuesta.organismo_expedidor
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

.controller('VehiculosCtrl', ['$scope', 'Main', '$mdDialog', function( $scope, Main, $mdDialog ) {


function CargarDatos() {
 Main.obtenerVehiculos(function(res) {
         $scope.listaviews = res;
    },
    function() {
      alert("Error al cargar lista");
    });  
};

CargarDatos();


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