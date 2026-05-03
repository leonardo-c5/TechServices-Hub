const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const serviceController = require('../controllers/serviceController');

// Configuración de dónde y cómo se guardan las fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Asegúrate de que la carpeta 'uploads' esté dentro de 'server'
  },
  filename: (req, file, cb) => {
    // Le pone la fecha actual al nombre para que no se repitan
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/', serviceController.getAllServices);

// IMPORTANTE: upload.single('image') permite recibir el archivo
router.post('/', upload.single('image'), serviceController.createService);

router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;