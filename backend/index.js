const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Añadir esta línea
const fichaRoutes = require('./routes/fichaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const programacionRoutes = require('./routes/programacionRoutes');
const evidenciaRoutes = require('./routes/evidenciaRoutes');

const cors = require("cors"); 
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Configurar rutas
app.use('/ficha', fichaRoutes);
app.use('/usuarios', usuarioRoutes);

app.use('/instructor', instructorRoutes);
app.use('/programacion', programacionRoutes); // Corrección aquí
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/evidencia', evidenciaRoutes);

// Sincronizar la base de datos y iniciar el servidor
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });
