// controllers/usuarioController.js

const Usuario = require('../models/usuarios');

exports.getUsuarioInactivos = async (req, res) => {
  try {
    const usuariosInactivos = await Usuario.findAll({ where: { estado: 'Inactivo' } });
    res.json(usuariosInactivos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { rol, estado } = req.body;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    usuario.rol = rol;
    usuario.estado = estado;
    await usuario.save();
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}; 

exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await usuario.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
