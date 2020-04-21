// Importamos express
var express = require('express');

// Importamos path para hacer path de manera sencilla y fileSystem
const path = require('path');
const fs = require('fs');

// Creamos el app 
var app = express();


app.get('/:coleccion/:imagen', (req, res, next) => {

    // Obtenemos los parámetros que se envían de la URL
    var coleccion = req.params.coleccion;
    var imagen = req.params.imagen;

    // Definimos el path donde va a tomar la imagen dependiendo la coleccion y la imagen que pida
    var pathImagen = path.resolve(__dirname, `../uploads/${coleccion}/${imagen}`);

    // Revisamos si existe
    if (fs.existsSync(pathImagen)) {

        res.sendFile(pathImagen);
    } else {

        var pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImagen);
    }
});

// Exportamos app
module.exports = app;