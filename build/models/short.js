'use strict';

module.exports = function (sequelize, DataTypes) {
  var Short = sequelize.define('Short', {
    duration: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'Los Cortos deben tener duración'
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
  Short.associate = function (models) {
    Short.belongsTo(models.GenericMedia, {
      foreignKey: 'GMId',
      onDelete: 'CASCADE'
    });
  };
  return Short;
};