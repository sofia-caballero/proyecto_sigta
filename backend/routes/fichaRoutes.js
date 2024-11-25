const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fichaController = require('../controllers/fichaController');

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se almacenarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para la imagen
  }
});
const upload = multer({ storage });

// Rutas
// Ruta para crear una ficha
router.post('/', upload.single('imagen'), fichaController.crearFicha);

// Ruta para obtener todas las fichas
router.get('/', fichaController.obtenerFichas);

// Ruta para obtener una ficha específica por su id
router.get('/:id', fichaController.obtenerFichaPorId);

const { verificarAutenticacion } = require('../middlewares/authMiddleware'); // Importación correcta


// Ruta para actualizar una ficha por su id (corregida)
router.put('/:id', upload.single('imagen'), fichaController.updateFicha); // Ahora usa '/:id' en lugar de '/ficha/:id'

module.exports = router;
