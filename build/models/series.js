'use strict';

module.exports = function (sequelize, DataTypes) {
  var Series = sequelize.define('Series', {
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
    initialYear: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'Por favor ingrese año de inicio'
      }
    },
    finalYear: {
      type: DataTypes.INTEGER
    },
    rating: {
      type: DataTypes.FLOAT
    },
    durationOfEpisode: {
      type: DataTypes.INTEGER,
      default: 22
    },
    link: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Por favor ingrese el link de IMDB'
      }
    },
    updatedDate: {
      type: DataTypes.DATE
    }
  }, {});
  Series.associate = function (models) {
    // associations can be defined here
    Series.hasMany(models.Season, {
      foreignKey: 'seriesId',
      onDelete: 'CASCADE'
    });
    Series.belongsToMany(models.User, {
      through: 'UserSerie',
      foreignKey: 'seriesId'
    });
    Series.belongsToMany(models.Genre, {
      through: 'SeriesGenre',
      foreignKey: 'seriesId'
    });
  };
  return Series;
};