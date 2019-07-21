'use strict';

module.exports = function (sequelize, DataTypes) {
  var GenericMedia = sequelize.define('GenericMedia', {
    image: {
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Por favor ingrese un titulo'
      }
    },
    year: {
      type: DataTypes.INTEGER
    },
    commentary: {
      type: DataTypes.STRING
    }
  }, {});
  GenericMedia.associate = function (models) {
    // associations can be defined here
    GenericMedia.belongsToMany(models.Genre, {
      through: 'GenreMedia',
      foreignKey: 'GMId'
    });
    GenericMedia.belongsToMany(models.User, {
      through: 'UserGM',
      foreignKey: 'GMId'
    });
    GenericMedia.hasOne(models.Movie, { foreignKey: 'GMId' });
    GenericMedia.hasOne(models.Short, { foreignKey: 'GMId' });
    GenericMedia.hasOne(models.Documentary, { foreignKey: 'GMId' });
    GenericMedia.hasOne(models.VideoGame, { foreignKey: 'GMId' });
    GenericMedia.hasOne(models.Book, { foreignKey: 'GMId' });
    GenericMedia.hasOne(models.Album, { foreignKey: 'GMId' });
  };
  return GenericMedia;
};