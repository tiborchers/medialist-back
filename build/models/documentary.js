'use strict';

module.exports = function (sequelize, DataTypes) {
  var Documentary = sequelize.define('Documentary', {
    duration: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'Las Peliculas deben tener duración'
      }
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: {
        args: false,
        msg: 'Debe tener un rating'
      }
    },
    GMId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'GenericMedia',
        key: 'id',
        as: 'GMId'
      }
    }
  }, {});
  Documentary.associate = function (models) {
    // associations can be defined here
    Documentary.belongsTo(models.GenericMedia, {
      foreignKey: 'GMId',
      onDelete: 'CASCADE'
    });
  };
  return Documentary;
};