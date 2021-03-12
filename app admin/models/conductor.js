
exports = module.exports = function(app, mongoose) {

var conductorShema = new mongoose.Schema({
    _id: { type: String },
    numero_licencia : { type: String },
    f_expedicion_doc : { type : Date },
    f_vencimiento_doc : { type : Date },
    organismo_expedidor : { type: String },
    asignado : { type : String}
});

 mongoose.model('Conductor', conductorShema);
 
};
