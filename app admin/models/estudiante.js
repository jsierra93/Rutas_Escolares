exports = module.exports = function(app, mongoose) {

var estudianteShema = new mongoose.Schema({
	_id: {type: String },
	padres : [{type : String}],
	latitud_hogar: {type: String },
	longitud_hogar: {type: String },
	grado_cursado : {type:  String},
	grupo_cursado : {type: String },
	asignado : {type: Boolean},
	estado : {type: String },
	direccion: {type: String}
	});

 mongoose.model('Estudiante', estudianteShema);

};