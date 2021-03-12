var mongoose = require('mongoose');
var Estudiante = mongoose.model('Estudiante');

exports.BuscarEstudiantes = function(req, res){

	Estudiante.find(function(err, estudiantes){
		if (err) res.send(500, err.message);

		console.log('GET/estudiantes')
			res.status(200).jsonp(estudiantes);
	});

};

exports.BuscarEstudianteId = function(req, res){

	Estudiante.findById(req.params.id, function(err, estudiantes){
		if (err) res.send(500, err.message);

		console.log('GET/estudiantesId')
			res.status(200).jsonp(estudiantes);
	});

};


exports.AgregarEstudiante = function(req, res){
	console.log('POST');
	console.log(req.body);

var estudiante = new Estudiante({
		_id: req.body._id,
		padres: req.body.padres,
		latitud_hogar:  req.body.latitud_hogar,
		longitud_hogar:  req.body.longitud_hogar,
		grado_cursado:  req.body.grado_cursado,
		grupo_cursado:  req.body.grupo_cursado,
		asignado: req.body.asignado,
		estado : "inactivo",
		direccion: req.body.direccion
	});

	estudiante.save(function(err, estudiante){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(estudiante);
	console.log('Estudiante Agregado');
	});
};

exports.ModificarEstudiante = function(req, res){

	console.log(req.body.estado);

	Estudiante.findById(req.params.id, function(err, estudiante){
		estudiante._id = req.body._id,
		estudiante.padres = req.body.padres,
		estudiante.latitud_hogar =  req.body.latitud_hogar,
		estudiante.longitud_hogar =  req.body.longitud_hogar,
		estudiante.grado_cursado =  req.body.grado_cursado,
		estudiante.grupo_cursado =  req.body.grupo_cursado,
		estudiante.asignado = req.body.asignado,
		estudiante.estado = req.body.estado,
		estudiante.direccion = req.body.direccion,


	estudiante.save(function(err){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(estudiante);
		console.log('Estudiante Modificado');
		});
	});
};

exports.EliminarEstudiante = function(req, res){

	Estudiante.findById(req.params.id, function(err, estudiante){
		estudiante.remove(function(err) {
			if (err) return res.send(500, err.message);
			res.status(200) 
			console.log('Estudiante Eliminado');
		})
	});
};