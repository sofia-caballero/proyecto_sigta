// models/Horario.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Ficha = require('./ficha'); // Importa el modelo de Ficha

const Horario = sequelize.define('Horario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  archivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'Activo',
  },
  fichaId: {
    type: DataTypes.INTEGER,
    references: {
      model: Ficha,
      key: 'id',
    },
  },
});

Horario.belongsTo(Ficha, { foreignKey: 'fichaId' });
module.exports = Horario;
