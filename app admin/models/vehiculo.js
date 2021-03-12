
exports = module.exports = function(app, mongoose) {

var vehiculoShema = new mongoose.Schema({
    _id: { type: String },
	licencia_transito : { type: String },
	linea : { type: String },
	modelo : { type: String },
	cilindrada: { type: String },
	color : { type: String },   
	servicio : { type: String },
	clase_vehiculo : { type: String },
	tipo : { type: String },
	combustible : { type: String },
	pasajeros : { type: String },
	numero_motor : { type: String },
	vn : { type: String },
	numero_chasis : { type: String },
	propietario : { type: String },
	identificacion : { type: String },
	numero_soat : { type: String },
	aseguradora : { type: String },
	f_expedicion_soat : { type: Date },
	f_vencimiento_soat : { type: Date },
	cod_sucursal : { type: String },
	clave_producto : { type: String },
	ciudad_expedicion : { type: String },
	numero_control : { type: String },
	centro_diagnostico : { type: String },
	nit : { type: String },
	f_expedicion_certificado : { type: Date },
	f_vencimiento_certificado : { type: Date },
	consecutivo_runt : { type: String },
	foto: { type : String},
	asignado : { type:  String} 
   });

 mongoose.model('Vehiculo', vehiculoShema);
 
};
