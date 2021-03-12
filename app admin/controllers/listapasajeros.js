var mongoose = require('mongoose');
var ListaPasajero = mongoose.model('ListaPasajeros');

exports.BuscarListaPasajeros = function(req, res){

	ListaPasajero.find(function(err, listapasajeros){
		if (err) res.send(500, err.message);

		console.log('GET/listapasajeros')
			res.status(200).jsonp(listapasajeros);
	});

};

exports.BuscarListaPasajeroId = function(req, res){

	ListaPasajero.findById(req.params.id, function(err, listapasajeros){
		if (err) res.send(500, err.message);

		console.log('GET/listapasajeros')
			res.status(200).jsonp(listapasajeros);
	});

};


exports.BuscarListaPasajeroConductor = function(req, res){
	console.log(req.params.id_conductor);
	ListaPasajero.findOne({'id_conductor': req.params.id_conductor}, function(err, listapasajeros){
		if (err) res.send(500, err.message);

		console.log('GET/listapasajeros - Conductor')
			res.status(200).jsonp(listapasajeros);
	});

};

exports.AgregarListaPasajero = function(req, res){
	console.log('POST');
	console.log(req.body);

var listapasajero = new ListaPasajero({
		_id : req.body._id,
		id_vehiculo: req.body.id_vehiculo,
		id_conductor: req.body.id_conductor,
		estudiantes:  req.body.estudiantes,
		latitud_vehiculo : req.body.latitud_vehiculo,
		longitud_vehiculo : req.body.longitud_vehiculo,
		estado : req.body.estado
	});

	listapasajero.save(function(err, listapasajero){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(listapasajero);
	});
};

exports.ModificarListaPasajero = function(req, res){

	ListaPasajero.findById(req.params.id, function(err, listapasajero){

		listapasajero._id = req.body._id,
		listapasajero.id_vehiculo = req.body.id_vehiculo,
		listapasajero.id_conductor = req.body.id_conductor,
		listapasajero.estudiantes =  req.body.estudiantes,
		listapasajero.latitud_vehiculo = req.body.latitud_vehiculo,
		listapasajero.longitud_vehiculo = req.body.longitud_vehiculo,
		listapasajero.estado = req.body.estado


	listapasajero.save(function(err){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(listapasajero);
		});
	});
};

exports.EliminarListaPasajero = function(req, res){
/*
	ListaPasajero.findById(req.params.id, function(err, listapasajero){
		listapasajero.remove(function(err) {
			if (err) return res.send(500, err.message);
			res.status(200) 
			console.log('Registro Eliminado..');
		})
	});*/

	ListaPasajero.remove( {_id : req.params.id }, 
		 function(err, listapasajero) {
            if (err)
                return res.send(500, err.message);
			res.status(200) 
			console.log('Registro Eliminado..');
			
        });
};