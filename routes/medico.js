var express = require('express');

var mdAuth = require('../middlewares/autenticacion');

var app = express();


var Medico = require('../models/medico');

// ==========================================================
//                     GET - MEDICOS
// ==========================================================

app.get('/', (req, res) => {

    // Desde que registro quiere mostrar el usuario, se envía por la url con la key from
    // Si se envía nada, por defecto va a ser 0. Además nos asegramos de que sea un número.
    var from = req.query.from || 0;
    from = Number(from);

    Medico.find({})
        // Mostramos desde el registro que el usuario indicó anteriormente
        .skip(from)
        // Mostramos de 3 en 3 
        .limit(3)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {

            if (err) {

                res.status(500).json({
                    ok: false,
                    mensaje: 'Ha ocurrido un error al obtener los médicos'
                });

            } else {

                // Contamos la cantidad de registros que hay en la colección
                Medico.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                });
            }
        });
});


// ==========================================================
//                     POST - MEDICOS
// ==========================================================

app.post('/', mdAuth.verificarToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({

        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital

    });

    medico.save((err, medicoGuardado) => {

        if (err) {

            res.status(500).json({
                ok: false,
                mensaje: 'Ha ocurrido un error al guardar el médico'
            });

        } else {

            res.status(200).json({
                ok: true,
                medico: medicoGuardado,
                usuarioCreador: req.usuario
            });
        }
    });
});



// ==========================================================
//                     PUT - MEDICOS
// ==========================================================

app.put('/:id', mdAuth.verificarToken, (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Medico.findById(id, (err, medicoEncontrado) => {

        if (err) {

            res.status(500).json({
                ok: false,
                mensaje: "Ha ocurrido un error al encontrar el médico"
            });

        } else if (!medicoEncontrado) {

            res.status(401).json({
                ok: false,
                mensaje: "No existe ese médico"
            });

        } else {

            medicoEncontrado.nombre = body.nombre;
            medicoEncontrado.usuario = req.usuario._id;
            medicoEncontrado.hospital = body.hospital;

            medicoEncontrado.save((err, medicoActualizado) => {

                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: "Ha ocurrido un error al actualizar el médico",
                        error: err
                    });

                } else {

                    res.status(200).json({
                        ok: true,
                        hospital: medicoActualizado,
                        usuarioActualizador: req.usuario
                    });
                }
            });
        }
    });
});


// ==========================================================
//                     DELETE - MEDICOS
// ==========================================================

app.delete('/:id', mdAuth.verificarToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoEliminado) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: "Ha ocurrido un error al borrar el médico"
            });

        } else {

            res.status(200).json({
                ok: true,
                hospital: medicoEliminado,
                usuarioEliminar: req.usuario
            });
        }

    });

});


module.exports = app;