const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.get('/', serviceController.getAllServices);       // Ver todos
router.post('/', serviceController.createService);       // Crear
router.put('/:id', serviceController.updateService);     // Editar
router.delete('/:id', serviceController.deleteService);  // Eliminar

module.exports = router;