const Ficha = require('../models/ficha');
const path = require('path');

// Función para crear una nueva ficha
exports.crearFicha = async (req, res) => {
    try {
        let { numero_ficha, programa_formacion, sede, fecha_inicio, fecha_fin, estado } = req.body;
        let imagen = req.file ? req.file.path : null;  // Ruta de la imagen

        // Crear una nueva ficha en la base de datos
        const nuevaFicha = await Ficha.create({
            numero_ficha,
            programa_formacion,
            sede,
            fecha_inicio,
            fecha_fin,
            estado,
            imagen
        });

        res.status(201).json({ message: 'Ficha creada correctamente', data: nuevaFicha });
    } catch (error) {
        console.error('Error creando la ficha:', error);
        res.status(500).json({ message: 'Error al crear la ficha', error });
    }
};

// Función para consultar todas las fichas
exports.obtenerFichas = async (req, res) => {
    try {
        const fichas = await Ficha.findAll();  // Consulta todas las fichas

        // Modificar las rutas de las imágenes
        const fichasConUrls = fichas.map(ficha => {
            return {
                ...ficha.toJSON(),
                imagenUrl: ficha.imagen ? `http://localhost:4000/uploads/${path.basename(ficha.imagen)}` : null
            };
        });

        res.status(200).json(fichasConUrls);  // Retorna las fichas con las URLs de las imágenes
    } catch (error) {
        console.error('Error obteniendo las fichas:', error);
        res.status(500).json({ message: 'Error al obtener las fichas', error });
    }
};

// Función para consultar una ficha específica por su id
exports.obtenerFichaPorId = async (req, res) => {
    const { id } = req.params;  // Obtenemos el id de la ficha desde los parámetros de la URL

    try {
        const ficha = await Ficha.findByPk(id);  // Busca la ficha por su id en la base de datos

        if (!ficha) {
            return res.status(404).json({ message: 'Ficha no encontrada' });
        }

        // Asegúrate de que la ruta de la imagen sea correcta
        const imagenUrl = ficha.imagen ? `http://localhost:4000/uploads/${path.basename(ficha.imagen)}` : null;

        res.status(200).json({ ...ficha.toJSON(), imagenUrl });  // Incluye la imagen en la respuesta
    } catch (error) {
        console.error('Error obteniendo la ficha:', error);
        res.status(500).json({ message: 'Error al obtener la ficha', error });
    }
};

// Método para actualizar una ficha
exports.updateFicha = async (req, res) => {
    try {
        const { id } = req.params; // Obtén el ID de los parámetros de la URL
        const { numero_ficha, programa_formacion, sede, fecha_inicio, fecha_fin, estado } = req.body;

        // Si se subió una nueva imagen, obtén el nombre del archivo desde req.file
        let imagen = req.file ? req.file.filename : null;

        // Encuentra la ficha por su ID
        const ficha = await Ficha.findByPk(id);

        // Si la ficha no existe, responde con un error
        if (!ficha) {
            return res.status(404).json({ message: 'Ficha no encontrada' });
        }

        // Actualiza los campos de la ficha con los nuevos datos (si existen en el cuerpo de la solicitud)
        ficha.numero_ficha = numero_ficha || ficha.numero_ficha;
        ficha.programa_formacion = programa_formacion || ficha.programa_formacion;
        ficha.sede = sede || ficha.sede;
        ficha.fecha_inicio = fecha_inicio || ficha.fecha_inicio;
        ficha.fecha_fin = fecha_fin || ficha.fecha_fin;
        ficha.estado = estado || ficha.estado;
        ficha.imagen = imagen || ficha.imagen; // Si se ha subido una nueva imagen, actualiza la imagen

        // Guarda los cambios en la base de datos
        await ficha.save();

        // Devuelve la ficha actualizada como respuesta
        return res.status(200).json(ficha);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar la ficha' });
    }
};
