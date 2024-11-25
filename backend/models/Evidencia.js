const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Evidencia = db.define('Evidencia', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    programacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    archivo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

module.exports = Evidencia;
