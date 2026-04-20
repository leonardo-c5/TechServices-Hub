const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.get('/', serviceController.getAllServices);      // Ver todos
router.post('/', serviceController.createService);     // Crear
router.put('/:id', serviceController.updateService);   // Editar (necesita ID)
router.delete('/:id', serviceController.deleteService); // Eliminar (necesita ID)

module.exports = router;