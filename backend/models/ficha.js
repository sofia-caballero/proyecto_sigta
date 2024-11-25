// models/Ficha.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ficha = sequelize.define('ficha', {
    numero_ficha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    programa_formacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sede: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Activo',
        validate: {
            isIn: [['Activo', 'Inactivo']]
        }
    },
    imagen: {
        type: DataTypes.STRING,  // Ruta de la imagen
        allowNull: true
    }
});

module.exports = Ficha;
