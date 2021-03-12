var gcm = require('node-gcm-service');
var gcmSender = new gcm.Sender();
    gcmSender.setAPIKey("AIzaSyDkVkrXWEjJmlTjdFlbqc6Fa4s0Rzo3PJQ");


exports.Registrar = function(req, res){
	
};

exports.NotificarInicio = function(req, res){
    
    var gcmMessage = new gcm.Message({

        collapse_key: "inicio",
        data : {
            message:"La ruta ha iniciado el recorrido",
            title:"Rutas Escolares"
        },
        delay_while_idle:true,
        time_to_live:1800,
        dry_run:false
    });

var registrationIds = req.body.tokens;
console.info(registrationIds);  

for(var i=0;i<registrationIds.length;i++){


        gcmSender.sendMessage(gcmMessage.toString(), registrationIds[i], true, function(err, data) {
            if (!err) {
               console.log('mensaje enviado.');
               console.info("data",JSON.stringify(data));
               
            } else {
                // handle error
               console.info("error",JSON.stringify(err));
               res.send(500).jsonp(err);
            }
        });
};
res.status(200).jsonp("Notificados");
};

exports.NotificarCambioEstado = function(req, res){
     console.log('Enviar notificacion de cambio de estado');
    var token = req.body.token,
        estado = req.body.estado,
        casa = req.body.casa,
        mensaje= "";

if (estado == 'activo'){
    
    mensaje = 'El niño subio a la ruta';
}else if ((estado == 'inactivo') && (casa == false)){
    mensaje = 'El niño llego a la escuela';
} else {
    
    mensaje = 'El niño llego a casa';
};
    

    var gcmMessage = new gcm.Message({

        collapse_key: "finalizo",
        data : {
            message: mensaje,
            title:"Rutas Escolares"
        },
        delay_while_idle:true,
        time_to_live:1800,
        dry_run:false
    });

var registrationIds = [];
    registrationIds.push(token);

for(var i=0;i<registrationIds.length;i++){


        gcmSender.sendMessage(gcmMessage.toString(), registrationIds[i], true, function(err, data) {
            if (!err) {
               console.log('mensaje enviado.');
               console.info("data",JSON.stringify(data));
            } else {
                // handle error
               console.info("error",JSON.stringify(err));
               res.send(500).jsonp(err);
            }
        });
};

    res.status(200).jsonp(mensaje);
};

exports.NotificarFinalizar = function(req, res){
    
    var gcmMessage = new gcm.Message({

        collapse_key: "finalizo",
        data : {
            message:"La ruta ha finalizado el recorrido",
            title:"Rutas Escolares"
        },
        delay_while_idle:true,
        time_to_live:1800,
        dry_run:false
    });

var registrationIds = req.body.tokens;

for(var i=0;i<registrationIds.length;i++){


        gcmSender.sendMessage(gcmMessage.toString(), registrationIds[i], true, function(err, data) {
            if (!err) {
               console.log('mensaje enviado.');
               console.info("data",JSON.stringify(data));
            } else {
                // handle error
               console.info("error",JSON.stringify(err));
               res.send(500).jsonp(err);
            }
        });
};
  res.status(200).jsonp("Notificados");
};

exports.Push = function(req, res){

console.log(req.body.token);

    var gcmMessage = new gcm.Message({

        collapse_key: "Prueba",
        data : {
            message:"Probando notificaciones de la aplicacion",
            title:"Rutas Escolares - Prueba"
        },
        delay_while_idle:true,
        time_to_live:1800,
        dry_run:false
    });

var registrationIds = [];
registrationIds.push(req.body.token);
console.log(registrationIds);  

for(var i=0;i<registrationIds.length;i++){


        gcmSender.sendMessage(gcmMessage.toString(), registrationIds[i], true, function(err, data) {
             if (!err) {
               console.log('mensaje enviado.');
               console.info("data",JSON.stringify(data));
            } else {
                // handle error
               console.info("error",JSON.stringify(err));
               res.send(500).jsonp(err);
            }
        });
};
};