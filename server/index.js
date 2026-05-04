require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// Importar Modelos
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

// 3. RUTA DE PRUEBA
app.get('/api', (req, res) => {
    res.json({ mensaje: "Backend TechServices funcionando correctamente" });
});

// 4. RUTAS PRINCIPALES
app.use('/api/services', serviceRoutes);

// NUEVA RUTA: Categorías con autogeneración (Seed)
app.get('/api/categorias', async (req, res) => {
    try {
        const count = await Categoria.count();
        if (count === 0) {
            // Si la tabla está vacía, creamos estas por defecto en Aiven
            await Categoria.bulkCreate([
                { name: 'Soporte Técnico', description: 'Mantenimiento y reparación' },
                { name: 'Desarrollo Web', description: 'Creación de sitios y apps' },
                { name: 'Ciberseguridad', description: 'Protección de datos y redes' },
                { name: 'Diseño UI/UX', description: 'Diseño de interfaces' }
            ]);
        }
        const categorias = await Categoria.findAll();
        res.json(categorias);
    } catch (error) {
        console.error("Error con categorías:", error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 10000;

// 5. SINCRONIZACIÓN Y ARRANQUE
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