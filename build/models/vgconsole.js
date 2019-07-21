'use strict';

module.exports = function (sequelize, DataTypes) {
  var VGConsole = sequelize.define('VGConsole', {
    VGId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'VideoGame',
        key: 'id',
        as: 'VGId'
      }
    },
    ConsoleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Console',
        key: 'id',
        as: 'ConsoleId'
      }
    }
  }, {});
  VGConsole.associate = function (models) {
    // associations can be defined here
  };
  return VGConsole;
};