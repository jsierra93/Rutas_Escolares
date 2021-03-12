var mongoose = require('mongoose');
var Conductor = mongoose.model('Conductor');

exports.BuscarConductores = function(req, res){

	Conductor.find(function(err, conductores){
		if (err) res.send(500, err.message);

		console.log('GET/conductores')
			res.status(200).jsonp(conductores);
	});

};

exports.BuscarConductorId = function(req, res){

	Conductor.findById(req.params.id, function(err, conductores){
		if (err) res.send(500, err.message);

		console.log('GET/conductores:ID')
			res.status(200).jsonp(conductores);
	});

};


exports.AgregarConductor = function(req, res){
	console.log('POST');
	console.log(req.body);

var conductor = new Conductor({
		_id: req.body._id,
		numero_licencia: req.body.numero_licencia,
		f_expedicion_doc:  req.body.f_expedicion_doc,
		f_vencimiento_doc:  req.body.f_vencimiento_doc,
		organismo_expedidor:  req.body.organismo_expedidor,
		asignado : req.body.asignado

	});

	conductor.save(function(err, conductor){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(conductor);
	});
};

exports.ModificarConductor = function(req, res){

	Conductor.findById(req.params.id, function(err, conductor){

		conductor._id = req.body._id,
		conductor.numero_licencia = req.body.numero_licencia,
		conductor.f_expedicion_doc =  req.body.f_expedicion_doc,
		conductor.f_vencimiento_doc =  req.body.f_vencimiento_doc,
		conductor.organismo_expedidor =  req.body.organismo_expedidor,
		conductor.asignado = req.body.asignado,


	conductor.save(function(err){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(conductor);
		});
	});
};

exports.EliminarConductor = function(req, res){

	Conductor.findById(req.params.id, function(err, conductor){
		conductor.remove(function(err) {
			if (err) return res.send(500, err.message);
			res.status(200) 
			console.log('Registro Eliminado.. Conductor');
		})
	});
};