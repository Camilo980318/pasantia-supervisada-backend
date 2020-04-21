// Importamos express
var express = require('express');

// Middlewares
var mdAuth = require('../middlewares/autenticacion');

// Creamos el app 
var app = express();

var Hospital = require('../models/hospital');

// ==========================================================
//                     GET - HOSPITALES
// ==========================================================

app.get('/', (req, res) => {

    // Desde que registro quiere mostrar el usuario, se envía por la url con la key from
    // Si se envía nada, por defecto va a ser 0. Además nos asegramos de que sea un número.
    var from = req.query.from || 0;
    from = Number(from);

    Hospital.find({})
        // Mostramos desde el registro que el usuario indicó anteriormente
        .skip(from)
        // Mostramos de 3 en 3 
        .limit(3)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {

            if (err) {

                res.status(500).json({
                    ok: false,
                    mensaje: "Ha ocurrido un error al obtener los hospitales",
                    error: err
                });

            } else {

                // Contamos la cantidad de registros que hay en la colección
                Hospital.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });


                });
            }

        });

});





// ==========================================================
//                     POST - HOSPITALES
// ==========================================================

app.post('/', mdAuth.verificarToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({

        nombre: body.nombre,
        usuario: req.usuario._id

    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {

            res.status(500).json({
                ok: false,
                mensaje: "Ha ocurrido un error al guardar el hospital"
            });

        } else {

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        }

    });

});




// ==========================================================
//                     PUT - HOSPITALES
// ==========================================================

app.put('/:id', mdAuth.verificarToken, (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Hospital.findById(id, (err, hospitalEncontrado) => {

        if (err) {

            res.status(500).json({
                ok: false,
                mensaje: "Ha ocurrido un error al actualizar el hospital"
            });

        } else if (!hospitalEncontrado) {

            res.status(401).json({
                ok: false,
                mensaje: "No existe ese hospital"
            });

        } else {

            hospitalEncontrado.nombre = body.nombre;
            hospitalEncontrado.usuario = req.usuario._id;

            hospitalEncontrado.save((err, hospitalActualizado) => {

                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Ha ocurrido un error al actualizar el hospital"
                    });

                } else {

                    res.status(200).json({
                        ok: true,
                        hospital: hospitalActualizado,
                        usuarioAct: req.usuario
                    });
                }

            });
        }

    });
});


// ==========================================================
//                    DELETE - HOSPITALES
// ==========================================================

app.delete('/:id', mdAuth.verificarToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {

            res.status(500).json({
                ok: false,
                mensaje: "Ha ocurrido un error al borrar el hospital"
            });

        } else {

            res.status(200).json({
                ok: true,
                hospitalBorrado: hospitalBorrado,
                usuarioBorr: req.usuario
            });
        }

    });

});


module.exports = app;