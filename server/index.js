require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// Importar Modelos (Asegúrate que las mayúsculas coincidan con tus archivos)
const Service = require('./models/Service');
const Categoria = require('./models/Categoria');

// Importar Rutas
const serviceRoutes = require('./routes/serviceRoutes');

const app = express();

// 1. CONFIGURACIÓN DE CORS REFORZADA (Para que Vercel no bloquee el POST)
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 2. RELACIONES (Punto 1.A del Proyecto)
Categoria.hasMany(Service, { foreignKey: 'categoriaId', as: 'servicios' });
Service.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });

// 3. RUTA DE PRUEBA (Para que al entrar a /api no salga "Cannot GET")
app.get('/api', (req, res) => {
    res.json({ mensaje: "Backend TechServices funcionando correctamente" });
});

// 4. RUTAS PRINCIPALES
app.use('/api/services', serviceRoutes);

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 10000; // Render prefiere el puerto 10000

// 5. SINCRONIZACIÓN Y ARRANQUE
// 'alter: true' es lo ideal para producción.
sequelize.sync({ alter: true }) 
    .then(() => {
        console.log('¡Conexión a Aiven exitosa y tablas actualizadas!');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor corriendo en puerto: ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error fatal en la base de datos:', err);
    });