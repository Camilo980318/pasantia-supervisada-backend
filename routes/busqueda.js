// Importamos express
var express = require('express');

// Creamos el app 
var app = express();

// Importamos los modelos
var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');

// ==========================================================
//                  BÚSQUEDA - COLECCIÓN
// ==========================================================

app.get('/coleccion/:colection/:busqueda', (req, res) => {

    var colection = req.params.colection;
    var busqueda = req.params.busqueda;

    var expreg = RegExp(busqueda, 'i');

    var promesa;

    switch (colection) {

        case 'hospitales':
            promesa = buscarHospital(expreg);
            break;

        case 'medicos':
            promesa = buscarMedico(expreg);
            break;

        case 'usuarios':
            promesa = buscarUsuario(expreg);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Solo se puede buscar por Hospitales, Usuarios y Médicos',
            })

    }


    promesa.then(respuesta => {

        if (respuesta == '') {
            res.status(401).json({
                ok: false,
                mensaje: 'No existe ningún registro con la palabra ' + busqueda
            });
        } else {
            res.status(200).json({
                ok: true,
                [colection]: respuesta
            })
        }
    });
});




// ==========================================================
//                   BÚSQUEDA - GENERAL
// ==========================================================

app.get('/todo/:busqueda', (req, res) => {

    // Capturamos el parámetro de búsqueda que envía desde la url
    var busqueda = req.params.busqueda;

    // Convertimos ese parámetro en una expresión regular, para hacer Key Unsensitive
    var expreg = RegExp(busqueda, 'i');



    // Con la función all de las promesas, podemos ejecutar un arreglo de promesas en paralelo
    // Recibimos la respuesta de las promesas en un arreglo y para acceder a ellas, es por posción

    Promise.all([
        buscarHospital(expreg),
        buscarMedico(expreg),
        buscarUsuario(expreg)

    ]).then(respuestas => {

        res.status(200).json({

            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        })
    });
});


// ==========================================================
//                  BÚSQUEDA - PROMESAS
// ==========================================================


// Creamos procesos asíncronos para retornar todo lo que estamos buscando en todas las colecciones
// Lo hacemos mediante promesas.

function buscarHospital(expreg) {
    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: expreg }).populate('usuario', 'nombre email role')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar los hospitales', err);

                } else {
                    resolve(hospitales);
                }
            });
    });
}



function buscarMedico(expreg) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: expreg })
            .populate('usuario', 'nombre email role')
            .populate('hospital', 'nombre')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar los hospitales', err);

                } else {
                    resolve(medicos);
                }
            });
    });
}



function buscarUsuario(expreg) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            // Con el .or(), nos permite realizar búsquedas por 2 o más parámetros
            .or([{ nombre: expreg }, { email: expreg }])
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar los hospitales', err);

                } else {
                    resolve(medicos);
                }
            });
    });
}




// Exportamos app
module.exports = app;