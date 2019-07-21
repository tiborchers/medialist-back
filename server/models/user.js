'use strict'

import bcrypt from 'bcrypt'

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'Please enter your name'
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'Please enter your username'
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'Please enter your email address'
        },
        unique: {
          args: true,
          msg: 'Email already exists'
        },
        validate: {
          isEmail: {
            args: true,
            msg: 'Please enter a valid email address'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'Please enter a password'
        },
        validate: {
          isNotShort: value => {
            if (value.length < 8) {
              throw new Error('Password should be at least 8 characters')
            }
          }
        }
      }
    },
    {}
  )
  User.beforeSave(async (user, options) => {
    if (user.changed('password')) {
      user.password = await bcrypt
        .hash(user.password, bcrypt.genSaltSync(10))
        .then(hash => (user.password = hash))
    }
  })
  User.prototype.comparePassword = function(passw) {
    return bcrypt.compare(passw, this.password)
  }
  User.associate = function(models) {
    User.belongsToMany(models.GenericMedia, {
      through: 'UserGM',
      foreignKey: 'userId'
    })
    User.belongsToMany(models.Episode, {
      through: 'UserEpisode',
      foreignKey: 'userId'
    })
    User.belongsToMany(models.Series, {
      through: 'UserSerie',
      foreignKey: 'userId'
    })
  }
  return User
}
