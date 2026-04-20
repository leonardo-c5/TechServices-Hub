require('dotenv').config(); // <--- ESTO DEBE IR PRIMERO QUE TODO
const express = require('express');
const cors = require('cors');
const serviceRoutes = require('./routes/serviceRoutes');
const sequelize = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Usar rutas
app.use('/api/services', serviceRoutes);

const PORT = process.env.PORT || 3000;

// Sincronizar y arrancar
sequelize.sync()
    .then(() => {
        console.log('Conexión a la base de datos establecida con éxito.');
        app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });