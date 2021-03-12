var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var jwt = require('jsonwebtoken');
var ClaveSecreta ='jsierra93';

exports.Login = function(req, res){
	
Usuario.find({_id: req.body._id, clave: req.body.clave /*, tipousuario : req.body.tipousuario*/}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {

                res.json({
                    type: true,
                    id: user._id,
                    data: user
                });
           console.log('Conectado usuario : '+req.body.tipousuario);    
                
            } else {
                res.json({
                    type: false,
                    data: "! Usuario/Contraseña incorrecta ¡"
                });    
            }
        }
    });

};


exports.Signup = function(req, res) {
    user={};
Usuario.findById({_id: req.body._id, clave: req.body.clave}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "El usuario existe!"
                });
            } else {
                var userModel = new Usuario();
                userModel._id = req.body._id;
                userModel.clave = req.body.clave;
                userModel.tipousuario = req.body.tipousuario;
                userModel.token = jwt.sign(userModel._id, ClaveSecreta);            
                userModel.save(function(err, user) {
                    
                            res.json({
                            type: true,
                            data: user,
                            token: user.token
                        });
                    });
                }
            }
    });
};

exports.BuscarUsuarios = function(req, res){

	Usuario.find(function(err, usuarios){
		if (err) res.send(500, err.message);

		console.log('GET/usuarios')
			res.status(200).jsonp(usuarios);
	});
};

exports.BuscarUsuarioId = function(req, res){

	Usuario.findById(req.params.id, function(err, usuarios){
		if (err) res.send(500, err.message);

		console.log('GET/usuarios')
			res.status(200).jsonp(usuarios);
	});

};


exports.ValidarAutorizacion = function(req, res, next) {
var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[0];
		req.token = bearerToken;       
        next();
    } else {
        res.send(403);
    }
};


exports.AgregarUsuario = function(req, res){
	console.log('POST');
	console.log(req.body);

var usuario = new Usuario({
		_id: req.body.id,
		clave: req.body.clave,
		tipousuario:  req.body.tipousuario,
		
	});

	usuario.save(function(err, usuario){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(usuario);
	});
};

exports.ModificarUsuario = function(req, res){

	Usuario.findById(req.params.id, function(err, usuario){

		usuario._id = req.body._id,
		usuario.clave = req.body.clave,
		usuario.tipousuario =  req.body.tipousuario,
		


	usuario.save(function(err){
		if(err) return res.send(500, err.message);
	res.status(200).jsonp(usuario);
		});
	});
};

exports.EliminarUsuario = function(req, res){

	Usuario.findById(req.params.id, function(err, usuario){
		usuario.remove(function(err) {
			if (err) return res.send(500, err.message);
			res.status(200) ;
		});
	});
};