exports = module.exports = function (app, mongosee) {

var listapasajerosSchema = new mongosee.Schema ({
	_id: {type : String},
	id_vehiculo : { type : String },
	id_conductor : { type : String },
	estudiantes : [ {type : String }],
	latitud_vehiculo: { type : String},
	longitud_vehiculo : { type : String },
	estado : { type: String }
});

mongosee.model('ListaPasajeros', listapasajerosSchema);
	
};

/*



lista pasajeros  || estudiantes 
	_id		----->	{ _id
					lat_hogar
					log_hogar}
			<----
*/