
exports = module.exports = function(app, mongoose) {

var tokengcmShema = new mongoose.Schema({
	_id : { type : String },
    id_padre: { type: String },
    id_estudiante : { type: String },
    id_ruta: { type : String },
    token : { type: String }
});

 mongoose.model('TokenGCM', tokengcmShema);
 
};
