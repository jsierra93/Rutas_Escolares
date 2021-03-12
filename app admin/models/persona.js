
exports = module.exports = function(app, mongoose) {

var personaShema = new mongoose.Schema({
    _id : {type: String },
    primer_nombre : {type: String },
    segundo_nombre : {type: String },
    primer_apellido :{type: String },
    segundo_apellido :{type: String },
    f_nacimiento : {type: Date },
    f_expedicion_documento : {type: Date },
    rh : {type: String } ,
    telefono : {type: String },
    celular : {type: String },
    foto : {type: String }
    });

 mongoose.model('Persona', personaShema);
 
};
