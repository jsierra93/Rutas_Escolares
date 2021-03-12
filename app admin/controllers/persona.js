var mongoose = require('mongoose');
var Persona = mongoose.model('Persona');

exports.BuscarPersonas = function(req, res){

	Persona.find(function(err, Personas){
		if (err) res.send(500, err.message);

		console.log('GET/Personas')
			res.status(200).jsonp(Personas);
	});

};

exports.BuscarPersonaId = function(req, res){

	Persona.findById(req.params.id, function(err, Personas){
		if (err) res.send(500, err.message);

		console.log('GET/Personas')
			res.status(200).jsonp(Personas);
	});

};


exports.AgregarPersona = function(req, res){
	console.log('POST/ Agregar Persona ');
	console.log(req.body);

var persona = new Persona({
		_id : req.body._id,
		primer_nombre: req.body.primer_nombre,
		segundo_nombre: req.body.segundo_nombre,
		primer_apellido:  req.body.primer_apellido,
		segundo_apellido:  req.body.segundo_apellido,
		f_nacimiento : req.body.f_nacimiento,
		f_expedicion_documento : req.body.f_expedicion_documento,
		rh : req.body.rh,
		telefono : req.body.telefono,
		celular : req.body.celular,
		foto : req.body.foto
	});

	persona.save(function(err, persona){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(persona);
	});
};

exports.ModificarPersona = function(req, res){

	Persona.findById(req.params.id, function(err, persona){

		persona.id = req.body.id,
		persona.primer_nombre = req.body.primer_nombre,
		persona.segundo_nombre = req.body.segundo_nombre,
		persona.primer_apellido =  req.body.primer_apellido,
		persona.segundo_apellido =  req.body.segundo_apellido,
		persona.f_nacimiento = req.body.f_nacimiento,
		persona.f_expedicion_documento = req.body.f_expedicion_documento,
		persona.rh = req.body.rh,
		persona.telefono = req.body.telefono,
		persona.celular = req.body.celular,
		persona.foto = req.body.foto


	persona.save(function(err){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(persona);
		});
	});
};

exports.EliminarPersona = function(req, res){

	Persona.findById(req.params.id, function(err, persona){
		persona.remove(function(err) {
			if (err) return res.send(500, err.message);
			res.status(200) 
			console.log('Registro Eliminado.. Persona');
		})
	});
};