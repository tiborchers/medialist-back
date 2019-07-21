'use strict'
module.exports = (sequelize, DataTypes) => {
  const Console = sequelize.define(
    'Console',
    {
      name: {
        type: DataTypes.STRING
      },
      image: {
        type: DataTypes.STRING
      },
      year: {
        type: DataTypes.INTEGER
      }
    },
    {}
  )
  Console.associate = function(models) {
    // associations can be defined here
    Console.belongsToMany(models.VideoGame, {
      through: 'VGConsole',
      foreignKey: 'ConsoleId'
    })
  }
  return Console
}
