'use strict';

module.exports = function (sequelize, DataTypes) {
  var UserGM = sequelize.define('UserGM', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
        as: 'userId'
      }
    },
    GMId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'GenericMedia',
        key: 'id',
        as: 'GMId'
      }
    },
    consumed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    consumedDate: {
      type: DataTypes.DATE
    }
  }, {});
  UserGM.associate = function (models) {
    // associations can be defined here
  };
  return UserGM;
};