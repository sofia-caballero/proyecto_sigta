const Instructor = require('../models/instructor');

// Consultar instructores
const getAllInstructores = async (req, res) => {
    const { numero_cedula, nombre, fecha_nacimiento, direccion, email, sede, estado } = req.body;

    try {
        const instructores = await Instructor.findAll(numero_cedula, nombre, fecha_nacimiento, direccion, email, sede, estado);
        res.json(instructores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener instructores.' });
    }
};

// Crear instructor
const createInstructor = async (req, res) => {
    const { numero_cedula, nombre, fecha_nacimiento, direccion, email, sede, estado } = req.body;

    try {
        const nuevoInstructor = await Instructor.create({
            numero_cedula, nombre, fecha_nacimiento, direccion, email, sede, estado
        });
        res.status(201).json(nuevoInstructor);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el instructor.' });
    }
};

// Actualizar instructor
const updateInstructor = async (req, res) => {
    const { id } = req.params; // Asumiendo que el ID se pasa en la URL
    const { numero_cedula, nombre, fecha_nacimiento, direccion, email, sede, estado } = req.body;

    try {
        const instructorActualizado = await Instructor.update(
            { numero_cedula, nombre, fecha_nacimiento, direccion, email, sede, estado },
            { where: { id: id } } // Asegúrate de que 'id' es el campo correcto para buscar
        );

        if (instructorActualizado[0] === 0) {
            return res.status(404).json({ error: 'Instructor no encontrado.' });
        }

        res.json({ message: 'Instructor actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el instructor.' });
    }
};

module.exports = {
    getAllInstructores,
    createInstructor,
    updateInstructor // Exportar la función de actualización
};
