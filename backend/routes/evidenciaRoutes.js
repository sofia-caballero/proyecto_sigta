const express = require('express');
const router = express.Router();
const evidenciaController = require('../controllers/evidenciaController');
const multer = require('multer');

// Configurar almacenamiento de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Ruta para crear evidencia
router.post('/', upload.single('archivo'), evidenciaController.crearEvidencia);

module.exports = router;
