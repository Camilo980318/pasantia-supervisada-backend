/*

Lo primero que vamos a poner son los Requires. 

Estos son básicamente importaciones de librerías (propias o de terceros) que ocupamos para que se 
pueda hacer una función, en este caso express

*/

var express = require('express');
var mongoose = require('mongoose');






/*

Lo siguiente, es inicializar variables, es decir, vamos a usar esa librería.
Vamos a crear la aplicación (el servidor express).

*/
var app = express();



/*

CONEXIÓN A LA BASE DE DATOS.

Al igual que las rutas, la conexión a la base de datos recibe 2 parámetros: la URL y una función
En el if, decimos que si hay algn error, el "throw", no permite que lo demás se haga. Si no hay
error, que deje pasar con un mensaje de confirmación

*/

mongoose.connection.openUri('mongodb://localhost:27017/uscoDB', (err, res) => {

    if (err) {
        throw err;
    } else {
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
    }

});




/*

RUTAS

Llamamos a la app y le decimos que tipo de servicio o petición queremos hacer (get, post, put, delete)
Después debemos definir 2 parametros: El path y un callback function. Esta función tiene varios pará -
metros: request(req), response(res), y next(Dice que cuando se ejecute continue con una op.)

*/

app.get('/', (req, res, next) => {

    // Recibimos la respuesta respecto al codigo de estado
    res.status(200).json({

        // Debemos estandarizar las salidas, para que toda la app responda de la misma manera
        ok: true,
        mensaje: "Peición realizada correctamente"
    });

});








// Vamos a poner a escuchar el servidor express, es decir, a escuchar peticiones.
// Y ponemos un mensaje en la consola para saber si todo salió bien.

app.listen(3000, () => {
    // Para cambiar el color de la palabra "online", se hace lo siguiente:
    console.log('Corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});