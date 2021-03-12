var mongoose = require('mongoose');
var Vehiculo = mongoose.model('Vehiculo');

exports.BuscarVehiculos = function(req, res){

	Vehiculo.find(function(err, vehiculos){
		if (err) res.send(500, err.message);

		console.log('GET/vehiculos')
			res.status(200).jsonp(vehiculos);
	});

};

exports.BuscarVehiculoId = function(req, res){

	Vehiculo.findById(req.params.id, function(err, vehiculos){
		if (err) res.send(500, err.message);

		console.log('GET/vehiculos')
			res.status(200).jsonp(vehiculos);
	});

};


exports.AgregarVehiculo = function(req, res){
	console.log('POST');
	console.log(req.body);

var vehiculo = new Vehiculo({
		_id: req.body._id,
		licencia_transito: req.body.licencia_transito,
		linea:  req.body.linea,
		modelo:  req.body.modelo,
		cilindrada: req.body.cilindrada,
		color: req.body.color,
		servicio:  req.body.servicio,
		clase_vehiculo:  req.body.clase_vehiculo,
		tipo: req.body.tipo,
		combustible: req.body.combustible,
		pasajeros:  req.body.pasajeros,
		numero_motor:  req.body.numero_motor,
		vn: req.body.vn,
		numero_chasis: req.body.numero_chasis,
		propietario:  req.body.propietario,
		identificacion:  req.body.identificacion,
		
		numero_soat:  req.body.numero_soat,
		aseguradora: req.body.aseguradora,
		f_expedicion_soat: req.body.f_expedicion_soat,
		f_vencimiento_soat:  req.body.f_vencimiento_soat,
		cod_sucursal:  req.body.cod_sucursal,
		clave_producto: req.body.clave_producto,
		ciudad_expedicion: req.body.ciudad_expedicion,

		numero_control:  req.body.numero_control,
		centro_diagnostico:  req.body.centro_diagnostico,
		nit: req.body.nit,
		f_expedicion_certificado: req.body.f_expedicion_certificado,
		f_vencimiento_certificado:  req.body.f_vencimiento_certificado,
		consecutivo_runt:  req.body.consecutivo_runt,
		foto : req.body.foto,
		asignado : req.body.asignado,
	});

	vehiculo.save(function(err, vehiculo){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(vehiculo);
	});
};

exports.ModificarVehiculo = function(req, res){

	Vehiculo.findById(req.params.id, function(err, vehiculo){

		vehiculo._id = req.body._id,
		vehiculo.licencia_transito = req.body.licencia_transito,
		vehiculo.linea =  req.body.linea,
		vehiculo.modelo =  req.body.modelo,
		vehiculo.cilindrada = req.body.cilindrada,
		vehiculo.color = req.body.color,
		vehiculo.servicio =  req.body.servicio,
		vehiculo.clase_vehiculo =  req.body.clase_vehiculo,
		vehiculo.tipo = req.body.tipo,
		vehiculo.combustible = req.body.combustible,
		vehiculo.pasajeros =  req.body.pasajeros,
		vehiculo.numero_motor =  req.body.numero_motor,
		vehiculo.vn = req.body.vn,
		vehiculo.numero_chasis = req.body.numero_chasis,
		vehiculo.propietario =  req.body.propietario,
		vehiculo.identificacion =  req.body.identificacion


		vehiculo.numero_soat =  req.body.numero_soat,
		vehiculo.aseguradora = req.body.aseguradora,
		vehiculo.f_expedicion_soat = req.body.f_expedicion_soat,
		vehiculo.f_vencimiento_soat =  req.body.f_vencimiento_soat,
		vehiculo.cod_sucursal =  req.body.cod_sucursal,
		vehiculo.clave_producto = req.body.clave_producto,
		vehiculo.ciudad_expedicion = req.body.ciudad_expedicion,

		vehiculo.numero_control =  req.body.numero_control,
		vehiculo.centro_diagnostico =  req.body.centro_diagnostico,
		vehiculo.nit =  req.body.nit,
		vehiculo.f_expedicion_certificado =  req.body.f_expedicion_certificado,
		vehiculo.f_vencimiento_certificado =  req.body.f_vencimiento_certificado,
		vehiculo.consecutivo_runt =  req.body.consecutivo_runt,
		vehiculo.foto = req.body.foto,
		vehiculo.asignado = req.body.asignado,

		vehiculo.soat = req.body.soat,


	vehiculo.save(function(err){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(vehiculo);
		});
	});
};

exports.EliminarVehiculo = function(req, res){

	Vehiculo.findById(req.params.id, function(err, vehiculo){
		vehiculo.remove(function(err) {
			if (err) return res.send(500, err.message);
			res.status(200) 
			console.log('Registro Eliminado..');
		})
	});
};