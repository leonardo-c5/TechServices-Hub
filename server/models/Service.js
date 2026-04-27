const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Categoria = require('./Categoria');

const Service = sequelize.define('Service', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    categoriaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Categoria,
            key: 'id'
        }
    }
}, {
    timestamps: true,
    paranoid: true // Requerimiento: Soft Delete
});

// DEFINIR RELACIONES AQUÍ ANTES DEL MODULE.EXPORTS
Categoria.hasMany(Service, { foreignKey: 'categoriaId', as: 'servicios' });
Service.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });

module.exports = Service;