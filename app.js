/* Definición de librerías y paquetes para apiCRUD */
require('dotenv').config();
const express = require('express');
const app = express();
const { response } = require('express');

const cors = require('cors');
const port = 3001;

const mysql = require('mysql2/promise');
let connection;

const bluebird = require('bluebird');
const any = require('bluebird/js/release/any');
const res = require('express/lib/response');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

/* Configuración de app */
app.use
app.use(express.json());
app.use(cors({ origin: true }));
app.set('port', process.env.PORT || port);
app.set('json spaces', 2);

/* Inicio -  Desarrollo de endPoints */

// POST insertar datos:
app.post("/insertarDatos", async (request, response) => {

    try {
        await connection.execute(
            `Insert into bdServicios.tbNotasEstudiante (codigoEstudiante, nombreEstudiante, asignatura, programaAcademico, nota, fechaCreacion, usuarioCreacion) values ("320099", "Adi Abonce", "Neurobiología y Adaptación", "Psicología", 4.5,  NOW(), "usuarioApiCrud");`
        );
        response.json({ status: "Ejecutado: Registro insertado" });
    } catch (error) {
        response.status(500).json({ error: 'Error en insertar datos' });
        console.log(error);
    }
}
);

// GET consultar datos:
app.get('/consultarDatos', async (request, response) => {
    const [rows, fields] = await connection.execute("SELECT codigoEstudiante, nombreEstudiante, asignatura, programaAcademico, nota, fechaCreacion, usuarioCreacion FROM bdServicios.tbNotasEstudiante");
    response.json({ data: rows });
});

// PUT Actualizar datos:
app.put('/actualizarDatos', async (request, response) => {

    const { codigoEstudiante, nota } = request.body;
    console.log(request.body);

    if (codigoEstudiante && nota) {
        try {
            await connection.execute(
                `Update bdServicios.tbNotasEstudiante set nota='${nota}' where codigoEstudiante='${codigoEstudiante}';`
            );
            console.log('entró al try: ' + nota);
            response.json({ status: "Registro actualizado" });
        } catch (error) {
            console.log(error);
            response.json({ status: "Error: Se presentó un error al actualizar" });
        }
    } else {
        response.json({ status: "Error: Petición errónea faltan datos" });
    }
}
);

// DELETE eliminar datos:
app.delete("/eliminarDatos", async (request, response) => {
    const { codigoEstudiante } = request.body;
    console.log(request.body);
    if (codigoEstudiante) {
        try {
            await connection.execute(
                `DELETE from bdServicios.tbNotasEstudiante where codigoEstudiante='${codigoEstudiante}';`
            );
            console.log('entró al try:');
            response.json({ status: "Registro Eliminado" });
        } catch (error) {
            console.log(error);
            response.json({ status: "Error: Se presentó un error al Eliminar" });
        } 
    } else {
        response.json({ status: "Error: Petición errónea faltan datos" });
    }
}
);

/* Fin -  Desarrollo de endPoints */

/* Iniciar servicio */
app.listen(app.get('port'), async () => {
    connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        Promise: bluebird
    });
    console.log("Servidor está corriendo en puerto: " + port);
});