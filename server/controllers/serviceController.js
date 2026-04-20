const Service = require('../models/Service');
// Crear un nuevo servicio
exports.createService = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const newService = await Service.create({ name, description, price });
        res.status(201).json(newService);
    } catch (error) {
        // Validación del CRUD Retador: Si el nombre está duplicado
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Error: El nombre del servicio ya existe." });
        }
        res.status(500).json({ message: "Error en el servidor", error });
    }
};

// Obtener todos los servicios (Para que el Alumno A los muestre)
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: "No se pudieron obtener los servicios" });
    }
};