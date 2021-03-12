
exports = module.exports = function(app, mongoose) {

var padreShema = new mongoose.Schema({
    _id: { type: String },
    estudiantes :  [{ type: String }],
    ocupacion : { type : String },
    direccion_trabajo : { type : String },
    telefono_trabajo : { type : String },
    email : { type : String }
});

 mongoose.model('Padre', padreShema);
 
};
