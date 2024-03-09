const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');



const app = express();
const port = 3000;

app.use(bodyParser.json());

// Configuración de la conexión a la base de datos MySQL
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'productos'
});

// Obtener todos los productos
app.get('/productos', (req, res) => {
    pool.query('SELECT * FROM inventario', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Agregar un nuevo producto
app.post('/productos', (req, res) => {
    const producto = req.body; // Asume que el cuerpo de la solicitud contiene el nuevo producto
    pool.query('INSERT INTO inventario SET ?', producto, (error, results) => {
        if (error) throw error;
        res.status(201).send(`Producto agregado con ID: ${results.insertId}`);
    });
});

// Actualizar un producto
app.put('/productos/:codigo', (req, res) => {
    const { codigo } = req.params;
    const { cantidad, descripcion, costo } = req.body;

    pool.query(
        'UPDATE inventario SET cantidad = ?, descripcion = ?, costo = ? WHERE codigo = ?',
        [cantidad, descripcion, costo, codigo],
        (error, results) => {
            if (error) throw error;
            res.send(`Producto con ID: ${codigo} actualizado.`);
        }
    );
});

// Escuchar en el puerto configurado
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
