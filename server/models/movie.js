'use strict'
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define(
    'Movie',
    {
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
    },
    {}
  )
  Movie.associate = function(models) {
    // associations can be defined here
    Movie.belongsTo(models.GenericMedia, {
      foreignKey: 'GMId',
      onDelete: 'CASCADE'
    })
  }
  return Movie
}
