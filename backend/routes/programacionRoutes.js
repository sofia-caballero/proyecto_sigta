// routes/programacionRoutes.js
const express = require('express');
const router = express.Router();
const programacionController = require('../controllers/programacionController');

// Ruta para crear una nueva programación
router.post('/', programacionController.createProgramacion);

// Ruta para obtener todas las programaciones
router.get('/', programacionController.getAllProgramaciones);
router.put('/:id', programacionController.updateProgramacion);

module.exports = router;
