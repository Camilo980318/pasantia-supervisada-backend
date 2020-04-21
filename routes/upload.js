// Importamos express
var express = require('express');

// Importamos la librería de fileUpload y fileSystem
var fileUpload = require('express-fileupload');
var fs = require('fs');

// Creamos el app 
var app = express();

// Importamos los modelos
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');


// Utilizamos el middleware de fileUpload
app.use(fileUpload());


// ==========================================================
//                     SUBIR IMÁGENES
// ===========================================================

app.put('/:colecciones/:id', (req, res) => {

    // Capturamos los parámetros de la URL
    var colecciones = req.params.colecciones;
    var id = req.params.id;

    // Defenimos las colecciones validas, para hacer la validación
    var coleccionesValidas = ['hospitales', 'medicos', 'usuarios'];

    if (coleccionesValidas.indexOf(colecciones) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: "Colección no permitida",
            errors: { mensaje: "Sólo se admiten colecciones: " + coleccionesValidas.join(', ') }

        });

    } else if (!req.files) {

        return res.status(400).json({
            ok: false,
            mensaje: "Debe seleccionar un archivo"
        });

    } else {

        // Hacemos validaciones, para admitir sólo cierto tipo de archivos
        // Sacamos la extensión del archivo
        var imagen = req.files.imagen;
        var nombreCortado = imagen.name.split('.');
        var extensionArchivo = nombreCortado[nombreCortado.length - 1];

        // Hacemos una lista de las extensiones permitidas
        var extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

        if (extensionesValidas.indexOf(extensionArchivo) < 0) {

            return res.status(400).json({
                ok: false,
                mensaje: "Tipo de archivo no permitido",
                errors: { mensaje: "Sólo se admiten archivos: " + extensionesValidas.join(', ') }
            });

        } else {

            // Cambiamos el nombre del archivo
            // Será de tipo id-milisegundos.extension -> fsdf35sdf6sdf53s-135.jpg
            var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

            // Movemos el archivo a una carpeta del servidor
            var path = `./uploads/${colecciones}/${nombreArchivo}`;
            imagen.mv(path, err => {

                if (err) {

                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error al mover el archivo",
                        error: err

                    });

                } else {

                    // Llamamos a la función actualizarFoto
                    actualizarFoto(colecciones, id, nombreArchivo, res);
                }

            });
        }
    }
});



// ================================================================
//  FUNCIÓN PARA ASIGNAR LA IMAGEN A UN USUARIO, HOSPITAL, MEDICO
// ================================================================

function actualizarFoto(colecciones, id, nombreArchivo, res) {

    // =================================
    //              Usuarios
    // =================================

    if (colecciones == "usuarios") {

        // Buscamos el usuario indicado
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "El usuario no existe",
                    error: err
                });
            }

            // Validamos si existe la imagen guardada para el usuario en la carpeta de usuarios
            // Si existe, la elimina
            var pathViejo = "./uploads/usuarios/" + usuario.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            // Guardamos la imagen nueva
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error al actualizar el usuario",
                        error: err
                    });

                } else {

                    usuarioActualizado.password = ":)"

                    res.status(200).json({
                        ok: true,
                        medico: usuarioActualizado
                    });
                }
            });

        });

        // =================================
        //              Médicos
        // =================================
    } else if (colecciones == "medicos") {

        // Buscamos el medico indicado
        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "El medico no existe",
                    error: err
                });
            }

            // Validamos si existe la imagen guardada para el medico en la carpeta de medicos
            // Si existe, la elimina
            var pathViejo = "./uploads/medicos/" + medico.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            // Guardamos la imagen nueva
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error al actualizar el medico",
                        error: err
                    });

                } else {

                    res.status(200).json({
                        ok: true,
                        medico: medicoActualizado
                    });
                }
            });

        });

        // =================================
        //             Hospitales
        // =================================
    } else if (colecciones == "hospitales") {

        // Buscamos el hospital indicado
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "El hospital no existe",
                    error: err
                });
            }

            // Validamos si existe la imagen guardada para el hospital en la carpeta de hospitales
            // Si existe, la elimina
            var pathViejo = "./uploads/hospitales/" + hospital.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            // Guardamos la imagen nueva
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error al actualizar el hospital",
                        error: err
                    });

                } else {

                    res.status(200).json({
                        ok: true,
                        medico: hospitalActualizado
                    });
                }
            });

        });

        // =================================
        //        Vacío/No corresponde
        // =================================
    } else {

        return res.status(500).json({
            ok: false,
            mensaje: "Error al subir la imagen",
            errors: { mensaje: "Ha sucedido un problema al subir la imagen" }

        });
    }
}

// Exportamos app
module.exports = app;