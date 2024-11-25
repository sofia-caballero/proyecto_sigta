const Evidencia = require('../models/Evidencia');
const path = require('path');
const fs = require('fs');

const crearEvidencia = async (req, res) => {
    try {
        const { programacion_id, texto } = req.body;
        const archivo = req.file ? req.file.filename : null;

        const evidencia = await Evidencia.create({
            programacion_id,
            texto,
            archivo,
        });

        res.status(201).json({
            message: 'Evidencia guardada exitosamente',
            evidencia,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la evidencia' });
    }
};

module.exports = {
    crearEvidencia,
};
