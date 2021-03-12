var mongoose = require('mongoose');
var TokenGCM = mongoose.model('TokenGCM');


exports.BuscarTokenGCMs = function(req, res){

	TokenGCM.find(function(err, tokengcms){
		if (err) res.send(500, err.message);

		console.log('GET/ tokengcm')
			res.status(200).jsonp(tokengcms);
	});

};

exports.BuscarTokenGCMId = function(req, res){

var token = null;

	TokenGCM.findOne({'_id': req.params.id },  function(err, tokengcm){
		console.log('id_padre');
		if (err) {
			res.send(500, err.message)
		};
		if (tokengcm == null )
		{

				TokenGCM.findOne({'id_estudiante': req.params.id },  function(err, tokengcm1){
					console.log('id_estudiante');
			if (err) {
				res.send(500, err.message)
			};

			if (tokengcm1 == null ){
					res.status(200).jsonp(token);
			
			}else {
				token = tokengcm1;
				console.log(token);
					res.status(200).jsonp(token);
			}
		});
	}else {
	
			token = tokengcm;
		console.log(token);
			res.status(200).jsonp(token);
		
		
	}
		
		
			
	});
};


exports.BuscarTokensGCMRuta = function(req, res){

	TokenGCM.find({'id_ruta': req.params.par1+"-"+req.params.par2},  function(err, tokengcms){
		if (err) res.send(500, err.message);

		console.log('GET/tokengcm Ruta');
		console.log(tokengcms);
			res.status(200).jsonp(tokengcms);
	});

};

exports.BuscarTokensGCMId = function(req, res){

	TokenGCM.findOne({'id_padre': req.params.id_padre },  function(err, tokengcms){
		if (err) res.send(500, err.message);

		console.log('GET/tokengcmsId');
		console.log(tokengcms);
			res.status(200).jsonp(tokengcms);
	});

};


exports.AgregarTokenGCM = function(req, res){
	console.log('POST');
	console.log(req.body);

var tokengcm = new TokenGCM({
	_id: req.body.id_padre,
	id_padre: req.body.id_padre,
	id_estudiante : req.body.id_estudiante,
	id_ruta : req.body.id_ruta,
	token : req.body.token
	});

	tokengcm.save(function(err, tokengcm){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(tokengcm);
	console.log('TokenGCM Agregado');
	});
};

exports.ModificarTokenPadre = function(req, res){

	TokenGCM.findOne({'_id': req.params.id }, function(err, tokengcm){
		tokengcm.id_padre= req.body.id_padre,
		tokengcm.id_estudiante = req.body.id_estudiante,
		tokengcm.id_ruta = req.body.id_ruta,
		tokengcm.token =  req.body.token,
		tokengcm._id = req.body._id,

	tokengcm.save(function(err){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(tokengcm);
		console.log('TokenGCM Modificado Padre');
		});
	});

};


exports.ModificarTokenEstudiante = function(req, res){

	TokenGCM.findOne({'id_estudiante': req.params.id }, function(err, tokengcm){
		tokengcm.id_padre= req.body.id_padre,
		tokengcm.id_estudiante = req.body.id_estudiante,
		tokengcm.id_ruta = req.body.id_ruta,
		tokengcm.token =  req.body.token,
		tokengcm._id = req.body._id,

	tokengcm.save(function(err){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(tokengcm);
		console.log('TokenGCM Modificado estudiante');
		});
	});
};

exports.EliminarTokenGCM = function(req, res){

	TokenGCM.findById(req.params.id_padre, function(err, tokengcm){
		console.log(tokengcm);
		tokengcm.remove(function(err) {
			if (err) return res.send(500, err.message);
			res.status(200).jsonp('Eliminado');
			console.log('TokenGCM Eliminado');
		})
	});
};

exports.EliminarTokenGCMId = function(req, res){

	TokenGCM.findOne({'id_padre': req.params.id },  function(err, tokengcm){
		console.log('id_padre');
		if (err) {
			res.send(500, err.message)
		};
		if (tokengcm == null )
		{
				TokenGCM.findOne({'id_estudiante': req.params.id },  function(err, tokengcm1){
					console.log('id_estudiante');
			if (err) {
				res.send(500, err.message)
			};

			if (tokengcm1 == null ){
					res.send(500, "No encontrado")
				
			}else {
				tokengcm1.remove(function(err) {
			if (err) return res.send(500, err.message);
			res.status(200).jsonp('Eliminado');
		})
			}
		});
	}else {
	
			tokengcm.remove(function(err) {
			if (err) return res.send(500, err.message);
			res.status(200).jsonp('Eliminado');
		})
	}			
	});
};

