// Importamos mongooose y el unique-validator
var mongooose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// Importamos los schemas de mongoose
var Schema = mongooose.Schema;


// Creamos un objeo en donde tendrán los roles válidos
var roleValue = {

    values: ["ADMIN", "USER"],
    message: "{PATH} no es un rol válido"

}

// Creamos el schema del usuario
var usuarioSchema = new Schema({

    // Aquí van cada uno de los campos que vamos a guardar en la base de datos
    nombre: { type: String, required: [true, "El nombre es requerido"] },
    email: { type: String, required: [true, "El email es necesario"], unique: true },
    password: { type: String, required: [true, "La contraseña es necesaria"] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER', enum: roleValue }


});

// Utilizamos el uniqueValidator para enviar un mensaje más agradable
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya registrado' });



// Exportamos el schema
module.exports = mongooose.model('usuario', usuarioSchema);