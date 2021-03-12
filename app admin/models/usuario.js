
exports = module.exports = function(app, mongoose) {

var usuarioShema = new mongoose.Schema({
   _id : {type: String },
   clave: {type: String },
   tipousuario: {type: String },
   token: { type: String }
});

 mongoose.model('Usuario', usuarioShema);
 
};
