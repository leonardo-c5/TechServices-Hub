require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// Importar Modelos para establecer relaciones
const Service = require('./models/Service');
const Categoria = require('./models/categoria');

// Importar Rutas
const serviceRoutes = require('./routes/serviceRoutes');

const app = express();

// CONFIGURACIÓN DE CORS (Abierta para que Vercel no de error)
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN DE RELACIONES (Punto 1.A del Trabajo)
// Una Categoría tiene muchos Servicios
Categoria.hasMany(Service, { foreignKey: 'categoriaId', as: 'servicios' });
Service.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });

// RUTAS 
// Cambiamos a '/api' para que la URL de Vercel sea más limpia
app.use('/api', serviceRoutes);

const PORT = process.env.PORT || 3000;

// SINCRONIZACIÓN CON LA NUBE (Aiven)
// 'alter: true' ayuda a que si agregaste columnas nuevas (como categoriaId), 
// Sequelize intente crearlas sin borrar tus datos.
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Conexión a Aiven exitosa y tablas actualizadas.');
        app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
    })
    .catch(err => {
        console.error('Error al conectar con la DB en la nube:', err);
    });