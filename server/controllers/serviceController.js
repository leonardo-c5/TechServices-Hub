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
        // LOGS PARA VER LA VERDAD EN RENDER
        console.log("Datos recibidos en el body:", req.body);
        console.log("Archivo recibido en req.file:", req.file);

        const { name, description, price, categoriaId } = req.body;
        
        // Si Multer funciona, req.file tendrá la información de la imagen
        let imagePath = null;
        if (req.file && req.file.filename) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        const newService = await Service.create({ 
            name, 
            description, 
            price,
            categoriaId: categoriaId ? categoriaId : null, // Parche: Si no hay categoría, usa null
            image: imagePath 
        });

        res.status(201).json(newService);
    } catch (error) {
        // ESTO APARECERÁ EN LA TERMINAL DE RENDER
        console.error("Error completo en el backend:", error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "El nombre del servicio ya existe" });
        }
        
        // ESTO SE ENVIARÁ AL FRONTEND
        res.status(500).json({ message: "Error DB: " + error.message });
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