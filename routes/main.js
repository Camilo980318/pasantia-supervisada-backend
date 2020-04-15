/*

RUTAS

Llamamos a la app y le decimos que tipo de servicio o petición queremos hacer (get, post, put, delete)
Después debemos definir 2 parametros: El path y un callback function. Esta función tiene varios pará -
metros: request(req), response(res), y next(Dice que cuando se ejecute continue con una op.)

*/



// IMportamos express
var express = require('express');

// Creamos el app 
var app = express();


app.get('/', (req, res, next) => {

    // Recibimos la respuesta respecto al codigo de estado
    res.status(200).json({

        // Debemos estandarizar las salidas, para que toda la app responda de la misma manera
        ok: true,
        mensaje: "Peición realizada correctamente"
    });

});

// Exportamos app
module.exports = app;