var express 	= require('express'),
	app			= express(),
	bodyParser  = require('body-parser'),
	methodOverride = require('method-override'),
	mongoose	 = require('mongoose'),
	multer = require('multer'),
	jwt = require('jsonwebtoken'),
	http = require('http'),
	server = app.listen(8080),
	//multipart = require('connect-multiparty'),
	io = require('socket.io').listen(server),
	mv = require('mv'),
	path = require('path'),
	fs = require('fs'),
	JSZip = require("jszip");

var router = express.Router();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};


mongoose.connect('mongodb://jsierra93:joansiji@ds041643.mongolab.com:41643/rutasescolares', function(err, res){
		if (err) throw err;
			console.log('Conectado a MongoLab');
	});
	
	//app.use(cors());
	app.use(express.static(__dirname + '/public'));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(multer()); //Importante para parsear POST
	app.use(allowCrossDomain);
	//app.use(multipart());

	app.set('fotos', __dirname + '/public/fotos');
  //app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/public/fotos" }));
  





	// METODOS SOCKET
//io.set('origins', '*');
	io.sockets.on('connection', function (client) {

	    console.log('Nuevo usuario conectado!!');
	    
	    client.emit('Bienvenido', 
	    	{ mensaje: 'Conectado al servidor de MY TRACK SCHOOL BUS.' }
	    );
		
		//Recibir ubicación inicial de la ruta y notificar a los padres correspondientes a dicha ruta
		client.on('iniciarRecorrido', function (data) {

			client.join(data.id_ruta);
			console.log("Inicia recorrido en : longitud:"+data.lat +" Latitud:"+data.lon);
			client.broadcast.in(data.id_ruta).emit('iniciarRecorrido', data);		
			client.broadcast.in(data.id_ruta).emit('actualizarCoordenadas', data);		
		});

		// Broadcast para que se actualicen los mapas de los padres y admin.
		client.on('actualizarCoordenadas', function (data) {
			var f = new Date(); 
			console.log('Latitud: '+data.lat+' Longitud : '+data.lon+ "  Hora "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds());
			client.broadcast.in(data.id_ruta).emit('actualizarCoordenadas', data);
		});

		// Notifica al admin y al padre de que el niño abordo el bus
		client.on('subirPasajero', function (data) {

		});

		// Notifica al admin y al padre de que el niño dejo el bus en casa o en la escuela
		client.on('bajarPasajero', function (data) {
		
		});


		client.on('llegandoDestino', function (data) {
		
		});

		//Solicitar confirmacion de que recibieron al niño en la casa
		client.on('confirmarLlegada', function (data) {
		
		});

		// Envia una alerta a todos en caso de novedades en el recorrido
		client.on('novedadRecorrido', function (data) {
			
			client.broadcast.emit('reportarFalla', data);
			console.log(data.id_ruta+' : '+data.mensaje);
		});

		// Notifica al admin que el bus termina su recorrido
		client.on('finalizarRecorrido', function (data) {
			client.broadcast.in(data.id_ruta).emit('finalizarRecorrido', data);		
		});

		client.on('CambiarSala', function (data) {
			client.join(data.Ruta._id);
			console.log('Cambio de sala a '+data.Ruta._id);
		});

	})

	
	//Modelos Api
	var ModeloEstudiante = require('./models/estudiante')(app, mongoose),
		ModeloPersona = require('./models/persona')(app, mongoose),
		ModeloUsuario = require('./models/usuario')(app, mongoose),
		ModeloConductor = require('./models/conductor')(app, mongoose),
		ModeloListaPasajeros = require('./models/listapasajeros')(app, mongoose),
		ModeloPadre = require('./models/padre')(app, mongoose),
		ModeloVehiculo = require('./models/vehiculo')(app, mongoose),
		ModeloGcm = require('./models/tokengcm')(app, mongoose),

		
	//Controladores Api 
		ControladorEstudiante = require('./controllers/estudiante'),
		ControladorPersona = require('./controllers/persona'),
		ControladorUsuario = require('./controllers/usuario'),
		ControladorConductor = require('./controllers/conductor'),
		ControladorListaPasajeros = require('./controllers/listapasajeros'),
		ControladorPadre = require('./controllers/padre'),
		ControladorVehiculo = require('./controllers/vehiculo'),
		ControladorGcm = require('./controllers/tokengcm'),
		ControladorNotificacion = require('./controllers/notificaciongcm');
		

	var Usuario = mongoose.model('Usuario');


	

	app.get('/' , function(req, res) {
		console.log('Entrando a la app admin');
		res.sendfile('public/index.html');
		
	});

	router.post('/subirAdjuntoVehiculos', function (req, res) {

	var errores = 0;
	var id = req.body.id;

		if(!fs.existsSync(__dirname + "/public/images/adjuntos/vehiculos/"+id)){
			 	
		     fs.mkdirSync(__dirname + "/public/images/adjuntos/vehiculos/"+id, 0766, function(err){
		       if(err){ 
		         console.log(err);
		         response.send("Error!! No se puede crear el directorio \n");    // echo the result back
		       }
		     });   
		 	}
		
		
		var file = req.files.file,
		      name = file.name,
		      type = file.type,
		      extension = file.extension,
		      path = __dirname + "/public/images/adjuntos/vehiculos/"+id+'/tarjeta_de_propiedad.'+extension;
		      
			mv(file.path, path, function(err) {
				if (err) throw err;
			//	res.redirect('/home.html#/vehiculos');
					});
					

		var file1 = req.files.file1,
		      name1 = file1.name,
		      type1 = file1.type,
		      extension1 = file1.extension,
		      path1 = __dirname + "/public/images/adjuntos/vehiculos/"+id+'/soat.'+extension1;

		       mv(file1.path, path1, function(err){
			   if(err) throw err;
			  });

	

				var file2 = req.files.file2,
		      		name2 = file2.name,
		      		type2 = file2.type,
		      		extension2 = file2.extension,
		      		path2 = __dirname + "/public/images/adjuntos/vehiculos/"+id+'/certificado.'+extension2;


				  	mv(file2.path, path2, function(err){
			    if(err) throw err;
			 	 });

var zip = new JSZip();

var Img = zip.folder(id);

	
	Img.file("tarjeta_de_propiedad."+extension, fs.readFileSync(path));
	Img.file("soat."+extension1, fs.readFileSync(path1));
	Img.file("certificado."+extension2, fs.readFileSync(path2));

var buffer = zip.generate({type:"nodebuffer"});

fs.writeFile(__dirname + "/public/images/adjuntos/vehiculos/"+id+"/"+id+".zip", buffer, function(err) {
  if (err) throw err;
});

res.redirect('/home.html#/vehiculos');

});



	router.post('/subirFoto', function (req, res) {
			var file = req.files.image,
		      name = file.name,
		      type = file.type,
		      path = __dirname + "/public/images/fotos/" + name;

  fs.rename(file.path, path, function(err){
    if(err) res.send("Ocurrio un error al intentar subir la imagen");
   res.redirect('/home.html#/');
  // console.log('Se guardo correctamente');
  });
	});

	router.get('/validarTokenBack', ControladorUsuario.ValidarAutorizacion, function(req, res){
	Usuario.findOne({token : req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Ha ocurrido un error"
            });
        } else {
            res.json({
                type: true,
                data: user,    
            });
      console.log('Usuario '+user._id+' se ha validado');    
        }
    });
    });

	// PETICIONES APP CONDUCTOR

	/*
	1. Inicia recorrido : conductor envia usuario, se consulta la ruta en la q esta asignado, actualiza
	coordenadas de ruta, cambia estado y se construye objeto con los datos de los pasajeros y devuelve 
	al cliente el obj.
	Crea conexion via socket (cliente - servidor ) y notifica a los padres del inicio de la ruta.

	2. Cambiar estado de pasajero: recibe id de pasajero cambiar estado (activo - inactivo ) y notificar al
	padre y admin.

	3. finalizar recorrido : buscar ruta, cambiar estado y notificar padres y admin.
	*/

    //API REST GENERAL

	router.get('/estudiantes' ,ControladorEstudiante.BuscarEstudiantes);
	router.get('/estudiantes/:id' ,ControladorEstudiante.BuscarEstudianteId);
	router.post('/estudiantes', ControladorEstudiante.AgregarEstudiante);
	router.put('/estudiantes/:id', ControladorEstudiante.ModificarEstudiante);
	router.delete('/estudiantes/:id', ControladorEstudiante.EliminarEstudiante);

	router.get('/personas', ControladorPersona.BuscarPersonas);
	router.get('/personas/:id', ControladorPersona.BuscarPersonaId);
	router.post('/personas', ControladorPersona.AgregarPersona);
	router.put('/personas/:id', ControladorPersona.ModificarPersona);
	router.delete('/personas/:id', ControladorPersona.EliminarPersona);	
	

	//funciona completo usuarios
	router.get('/usuarios', ControladorUsuario.BuscarUsuarios);
	router.get('/usuarios/:id', ControladorUsuario.BuscarUsuarioId);
	//router.get('/me', ControladorUsuario.me );
	router.post('/usuarios', ControladorUsuario.AgregarUsuario);
	router.post('/login', ControladorUsuario.Login);
	router.post('/signup', ControladorUsuario.Signup);
	router.put('/usuarios/:id', ControladorUsuario.ModificarUsuario);
	router.delete('/usuarios/:id', ControladorUsuario.EliminarUsuario);	
	
	router.get('/padres', ControladorPadre.BuscarPadres);
	router.get('/padres/:id', ControladorPadre.BuscarPadreId);
	router.post('/padres', ControladorPadre.AgregarPadre);
	router.put('/padres/:id', ControladorPadre.ModificarPadre);
	router.delete('/padres/:id', ControladorPadre.EliminarPadre);	
	
	router.get('/conductores', ControladorConductor.BuscarConductores);
	router.get('/conductores/:id', ControladorConductor.BuscarConductorId);
	router.post('/conductores', ControladorConductor.AgregarConductor);
	router.put('/conductores/:id', ControladorConductor.ModificarConductor);
	router.delete('/conductores/:id', ControladorConductor.EliminarConductor);	

	router.get('/vehiculos', ControladorVehiculo.BuscarVehiculos);
	router.get('/vehiculos/:id', ControladorVehiculo.BuscarVehiculoId);
	router.post('/vehiculos', ControladorVehiculo.AgregarVehiculo);
	router.put('/vehiculos/:id', ControladorVehiculo.ModificarVehiculo);
	router.delete('/vehiculos/:id', ControladorVehiculo.EliminarVehiculo);	
	
	router.get('/listapasajeros', ControladorListaPasajeros.BuscarListaPasajeros);
	router.get('/listapasajeros/:id', ControladorListaPasajeros.BuscarListaPasajeroId);
	router.get('/listapasajerosConductor/:id_conductor', ControladorListaPasajeros.BuscarListaPasajeroConductor);
	router.post('/listapasajeros', ControladorListaPasajeros.AgregarListaPasajero);
	router.put('/listapasajeros/:id', ControladorListaPasajeros.ModificarListaPasajero);
	router.delete('/listapasajeros/:id', ControladorListaPasajeros.EliminarListaPasajero);	
	
	
	router.get('/gcm/:id', ControladorGcm.BuscarTokenGCMId);
	router.post('/gcm', ControladorGcm.AgregarTokenGCM)
	router.get('/gcmruta/:par1-:par2', ControladorGcm.BuscarTokensGCMRuta);
	router.put('/gcmestudiante/:id', ControladorGcm.ModificarTokenEstudiante);
	router.put('/gcmpadre/:id', ControladorGcm.ModificarTokenPadre)
	router.delete('/gcm/:id', ControladorGcm.EliminarTokenGCMId);	
	
	
	router.post('/notificarinicio', ControladorNotificacion.NotificarInicio);
	router.post('/notificarcambioestado', ControladorNotificacion.NotificarCambioEstado);
	router.post('/notificarfinalizar', ControladorNotificacion.NotificarFinalizar);

	router.post('/temporal', ControladorNotificacion.Registrar);

	router.post('/prueba', ControladorNotificacion.Push);
	
	app.use(router);

