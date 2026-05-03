const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener servicios" });
    }
};

exports.createService = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        
        // Si Multer funciona, req.file tendrá la información de la imagen
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newService = await Service.create({ 
            name, 
            description, 
            price,
            image: imagePath // Guardamos la ruta en la DB
        });

        res.status(201).json(newService);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "El nombre del servicio ya existe" });
        }
        res.status(500).json({ message: "Error al crear" });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Service.update(req.body, { where: { id: id } });
        if (updated) {
            const updatedService = await Service.findByPk(id);
            return res.status(200).json(updatedService);
        }
        throw new Error('Servicio no encontrado');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Service.destroy({ where: { id: id } });
        if (deleted) {
            return res.status(204).send("Servicio eliminado");
        }
        throw new Error('Servicio no encontrado');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};