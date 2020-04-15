// Importamos la librería del token
var jwt = require('jsonwebtoken');

// Importamos el seed del token definido en config.js
var SEED = require('../config/config').SEED;



// ==========================================================
//   MIDDLEWARE - VERIFICAR TOKEN (Método que vamos a usar)
// ==========================================================

// Exportamos la funcion verificarToken
module.exports.verificarToken = function(req, res, next) {

    // Recibimos el token de la URL, pero no de la forma ->'/:token'
    var token = req.query.token;


    // Verificamos si el token es válido
    jwt.verify(token, SEED, (err, decoded) => {

        // Comprobamos si está el error, enviamos un mensaje de error y codigo de estado
        if (err) {

            res.status(403).json({
                ok: false,
                mensaje: "Token no válido",
                err: err
            });

            // Si todo sale bien
        } else {

            // Para obtener la referencia del usuario logueado que hizo la petición
            req.usuario = decoded.usuario;
            req.usuario.password = ":)"

            next();

        }
    });
}