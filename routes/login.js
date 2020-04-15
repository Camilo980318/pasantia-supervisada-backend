// Importamos express
var express = require('express');

// Importamos el método de encriptación 
var bcrypt = require('bcryptjs');

// Importamos la librería del token
var jwt = require('jsonwebtoken');

// Importamos el seed del token definido en config.js
var SEED = require('../config/config').SEED;

// Creamos el app 
var app = express();

// Importamos el modelo
var Usuario = require('../models/usuario');



// ==========================================================
//                         LOGIN
// ==========================================================

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {


        // Comprobamos si está el error, enviamos un mensaje de error y codigo de estado
        if (err) {
            res.status(500).json({

                ok: false,
                mensaje: "Error al encontrar el usuario en la BD",
                err: err
            });




            // Comprobamos si no existe el usuario con ese email
        } else if (!usuarioDB) {
            res.status(400).json({

                ok: false,
                mensaje: "Credenciales incorrectas - email",
            });




            // Comparamos si no coinciden las contraseñas
        } else if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            res.status(400).json({

                ok: false,
                mensaje: "Credenciales incorrectas - password",
            });





            // Si todo sale bien
        } else {

            // Creamos el web token
            // Los parámetros son: 
            // 1. El usuario que se va a loguear
            // 2. Las semilla o firma (Para autenticar el token) --> Lo obtenemos de config.js
            // 3. El tiempo en que va a expirar el token
            var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

            usuarioDB.password = ":)"

            res.status(200).json({
                ok: true,
                mensaje: "Login correcto",
                usuario: usuarioDB,
                id: usuarioDB._id,
                token: token

            });
        }
    });
});



module.exports = app;