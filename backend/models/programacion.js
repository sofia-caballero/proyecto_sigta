// models/programacion.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Programacion = sequelize.define('Programacion', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ficha_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    profesional_1: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    profesional_2: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    instructor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    sede: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('Programado', 'Finalizado', 'Cancelado'),
      defaultValue: 'Programado',  
      
  }
});

module.exports = Programacion;
