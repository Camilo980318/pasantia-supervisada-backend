/*

Lo primero que vamos a poner son los Requires. 

Estos son básicamente importaciones de librerías (propias o de terceros) que ocupamos para que se 
pueda hacer una función, en este caso express

*/

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')




/*

Lo siguiente, es inicializar variables, es decir, vamos a usar esa librería.
Vamos a crear la aplicación (el servidor express).

*/
var app = express();


// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importación de rutas
var mainRoute = require('./routes/main');
var usuarioRoute = require('./routes/usuario');
var loginRoute = require('./routes/login');
var hospitalRoute = require('./routes/hospital');
var medicoRoute = require('./routes/medico');
var busquedaRoute = require('./routes/busqueda');
var uploadRoute = require('./routes/upload');
var imagenesRoute = require('./routes/imagen');



/*

CONEXIÓN A LA BASE DE DATOS.

Al igual que las rutas, la conexión a la base de datos recibe 2 parámetros: la URL y una función
En el if, decimos que si hay algn error, el "throw", no permite que lo demás se haga. Si no hay
error, que deje pasar con un mensaje de confirmación

*/

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

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

app.use('/img', imagenesRoute);
app.use('/upload', uploadRoute);
app.use('/buscar', busquedaRoute);
app.use('/medico', medicoRoute);
app.use('/hospital', hospitalRoute);
app.use('/login', loginRoute);
app.use('/usuario', usuarioRoute);
app.use('/', mainRoute);






// Vamos a poner a escuchar el servidor express, es decir, a escuchar peticiones.
// Y ponemos un mensaje en la consola para saber si todo salió bien.

app.listen(3000, () => {
    // Para cambiar el color de la palabra "online", se hace lo siguiente:
    console.log('Corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});