// Importamos express
var express = require('express');

// Importamos el método de encriptación
var bcrypt = require('bcryptjs');

/* Importamos la librería del token
var jwt = require('jsonwebtoken');

// Importamos el seed del token definido en config.js
var SEED = require('../config/config').SEED; */

// Importamos el middleware de la auth
var mdAuth = require('../middlewares/autenticacion');

// Creamos el app 
var app = express();

// Importamos el modelo
var Usuario = require('../models/usuario');




// ==========================================================
//                      GET USUARIOS
// ===========================================================

app.get('/', (req, res, next) => {

    // Hacemos un query, este recibirá: err, si pasa algo malo; los datos, si sale todo bien
    // Después del find, le pasamos los campos que queremos mostrar
    Usuario.find({}, 'nombre email img role').exec((err, usuario) => {

        // Comprobamos si está el error, enviamos un mensaje de error y codigo de estado
        if (err) {

            res.status(500).json({

                ok: false,
                mensaje: "Error al leer de la BD",
                err: err
            });


            // Si todo sale bien
        } else {

            res.status(200).json({
                ok: true,
                usuarios: usuario
            });
        }

    });

});

/*
// ==========================================================
// MIDDLEWARE - VERIFICAR TOKEN (Método que no vamos a usar)
// ==========================================================

app.use('/', (req, res, next) => {

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
            // Permite que se siga el proceso de aqui en adelante
            next();
        }
    });
});
*/



// ==========================================================
//                      POST USUARIO
// ==========================================================

// Como segundo parámetro enviamos el middleware
app.post('/', mdAuth.verificarToken, (req, res) => {


    // Hacemos referencia al body-parser
    var body = req.body;

    // Capturamos los datos del postman utilizando el body-parser para ponerlo en JSON
    var usuario = new Usuario({

        nombre: body.nombre,
        email: body.email,
        // Encriptamos la contraseña con el hashSync de bcrypt (LoQueEncriptar, #Digitos)
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    // Guardamos, recibirá o un error o el usuarioGuardado
    usuario.save((err, usuarioGuardado) => {

        if (err) {

            res.status(400).json({
                ok: false,
                mensaje: "Error al guardar en la BD",
                errors: err
            });

            // Si todo sale bien
        } else {

            usuarioGuardado.password = ":)"

            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado,
                // Referencia del usuario logueado que lo creó (viene del middleware)
                usuarioCreador: req.usuario

            });
        }
    });

});




// ==========================================================
//                      PUT USUARIO
// ==========================================================

app.put('/:id', mdAuth.verificarToken, (req, res) => {

    // Capturamos el id que se envía en la url
    var id = req.params.id;

    // Hacemos referencia al bodyparser para obtener lo del x-www-form
    var body = req.body;


    // Buscamos el usuario respecto al id enviado
    Usuario.findById(id, (err, usuarioEncontrado) => {

        // Confirmamos que no haya error
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: "Error al encontrar el usuario " + id + " en la BD",
                errors: err
            });



            // Confirmamos si el usuario está vacío
        } else if (!usuarioEncontrado) {
            res.status(500).json({
                ok: false,
                mensaje: "El usuario no se encuentra en la BD",
                errors: { message: "El usuario no se encuentra en la BD" }
            });



            // Si todo sale bien
        } else {

            // Obtenemos lo que se envia del x-www-form y se lo asignamos al usuario encontrado
            usuarioEncontrado.nombre = body.nombre;
            usuarioEncontrado.email = body.email;
            usuarioEncontrado.role = body.role;

            // Guardamos los cambios
            usuarioEncontrado.save((err, usuarioActualizado) => {


                // Confirmamos que no haya error
                if (err) {
                    res.status(400).json({
                        ok: false,
                        mensaje: "Error al actualizar el usuario",
                        errors: err
                    });



                    // Si todo sale bien
                } else {
                    // Mostramos el password, pero no lo guadamos
                    usuarioActualizado.password = ":c"

                    // Devolvemos el usuario actualizado
                    res.status(201).json({
                        ok: true,
                        usuario: usuarioActualizado,
                        // Referencia del usuario logueado que lo creó (viene del middleware)
                        usuarioActualizador: req.usuario
                    });
                }
            });
        }
    });
});



// ==========================================================
//                      DELETE USUARIO
// ==========================================================

app.delete('/:id', mdAuth.verificarToken, (req, res) => {

    // Capturamos el id que se envía en la url
    var id = req.params.id;


    // Buscamos el usuario por Id y lo borramos
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {


        // Confirmamos de que no hayan errores
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: "Error al encontrar el usuario " + id + " en la BD",
                errors: err
            });



            // Confirmamos de que el usuario borrado se encuentre en la BD
        } else if (!usuarioBorrado) {

            res.status(500).json({
                ok: false,
                mensaje: "No existe el usuario con ese ID",
            });



            // Si todo sale bien
        } else {

            res.status(200).json({

                ok: true,
                message: "Usuario borrado correctamente",
                usuario: usuarioBorrado,
                // Referencia del usuario logueado que lo creó (viene del middleware)
                usuarioEliminador: req.usuario

            });
        }
    });

});


// Exportamos app
module.exports = app;