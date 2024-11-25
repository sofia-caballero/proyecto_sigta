const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarios');
const usuarioController = require('../controllers/usuarioController');

// Ruta para obtener todos los usuarios (GET)
router.get('/', async (req, res) => {
  console.log('GET /usuarios');
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para crear un nuevo usuario (POST)
router.post('/', async (req, res) => {
  console.log('POST /usuarios');
  const { numero_de_documento, nombre, correo, password, rol, estado } = req.body;
  try {
    const nuevoUsuario = await Usuario.create({
      numero_de_documento,
      nombre,
      correo,
      password,
      rol,
      estado
    });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener usuarios inactivos
router.get('/inactivos', usuarioController.getUsuarioInactivos);

// Actualizar usuario (estado y rol)
router.put('/:id', usuarioController.updateUsuario);

// Eliminar usuario
router.delete('/:id', usuarioController.deleteUsuario);

// Exportar el router
module.exports = router;
