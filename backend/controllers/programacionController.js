const Programacion = require('../models/programacion'); // Asegúrate de que el modelo Programacion esté correctamente importado
const { Op } = require('sequelize');  // Importar Op para las operaciones lógicas de Sequelize

// Crear una programación
exports.createProgramacion = async (req, res) => {
    const { nombre, ficha_id, profesional_1, profesional_2, instructor_id, fecha, hora, sede, estado } = req.body;

    try {
        // Validación: Verificar conflictos de horario
        const existingProgram = await Programacion.findOne({
            where: {
                fecha,
                hora,
                [Op.or]: [
                    { profesional_1 },
                    { profesional_2 },
                    { instructor_id }
                ]
            }
        });

        if (existingProgram) {
            return res.status(400).json({ message: 'Ya hay un taller programado para este horario o profesional.' });
        }

        // Crear nueva programación
        const nuevaProgramacion = await Programacion.create({
            nombre,
            ficha_id,
            profesional_1,
            profesional_2,
            instructor_id,
            fecha,
            hora,
            sede,
            estado
        });

        res.status(201).json({ message: 'Programación creada exitosamente', programacion: nuevaProgramacion });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear programación', error });
    }
};

// Obtener todas las programaciones
exports.getAllProgramaciones = async (req, res) => {
    try {
        const programaciones = await Programacion.findAll();
        res.status(200).json(programaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener programaciones', error });
    }
};




// Actualizar instructor
exports. updateProgramacion = async (req, res) => {
    const { id } = req.params; // Asumiendo que el ID se pasa en la URL
    const {ficha_id,nombre,  profesional_1, profesional_2, instructor_id, fecha, hora, sede, estado } = req.body;

    try {
        const programacioActualizado = await Programacion.update(
            { ficha_id,nombre,  profesional_1, profesional_2, instructor_id, fecha, hora, sede, estado},
            { where: { id: id } } // Asegúrate de que 'id' es el campo correcto para buscar
        );

        if (programacioActualizado[0] === 0) {
            return res.status(404).json({ error: 'Instructor no encontrado.' });
        }

        res.json({ message: 'Instructor actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el instructor.' });
    }
};


