var mongoose = require('mongoose');
var Padre = mongoose.model('Padre');
var Persona = mongoose.model('Persona');

exports.BuscarPadres = function(req, res){

	Padre.find(function(err, padres){
		if (err) res.send(500, err.message);

		console.log('GET/padres')
			res.status(200).jsonp(padres);
	});

};

exports.BuscarPadreId = function(req, res){

	Padre.findById(req.params.id, function(err, padres){
		if (err) res.send(500, err.message);

		console.log('GET/padresId')
			res.status(200).jsonp(padres);
	});

};


exports.AgregarPadre = function(req, res){
	console.log('POST /agregar PADRE');
	console.log(req.body);

var padre = new Padre({
		_id: req.body._id,
		estudiantes: req.body.estudiantes,
		ocupacion:  req.body.ocupacion,
		direccion_trabajo:  req.body.direccion_trabajo,
		telefono_trabajo:  req.body.telefono_trabajo,
		email:  req.body.email
	});

	padre.save(function(err, padre){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(padre);
	});
};

exports.ModificarPadre = function(req, res){

	Padre.findById(req.params.id, function(err, padre){

		padre._id = req.body._id,
		padre.estudiantes = req.body.estudiantes,
		padre.ocupacion =  req.body.ocupacion,
		padre.direccion_trabajo =  req.body.direccion_trabajo,
		padre.telefono_trabajo =  req.body.telefono_trabajo,
		padre.email =  req.body.email,




	padre.save(function(err){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(padre);
		});
	});
};

exports.EliminarPadre = function(req, res){

	Padre.findById(req.params.id, function(err, padre){
		padre.remove(function(err) {
			if (err) return res.send(500, err.message);
			res.status(200) 
			console.log('Registro Eliminado..');
		})
	});
};