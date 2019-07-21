'use strict';

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
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
        isNotShort: function isNotShort(value) {
          if (value.length < 8) {
            throw new Error('Password should be at least 8 characters');
          }
        }
      }
    }
  }, {});
  User.beforeSave(function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user, options) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!user.changed('password')) {
                _context.next = 4;
                break;
              }

              _context.next = 3;
              return _bcrypt2.default.hash(user.password, _bcrypt2.default.genSaltSync(10)).then(function (hash) {
                return user.password = hash;
              });

            case 3:
              user.password = _context.sent;

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  User.prototype.comparePassword = function (passw) {
    return _bcrypt2.default.compare(passw, this.password);
  };
  User.associate = function (models) {
    User.belongsToMany(models.GenericMedia, {
      through: 'UserGM',
      foreignKey: 'userId'
    });
    User.belongsToMany(models.Episode, {
      through: 'UserEpisode',
      foreignKey: 'userId'
    });
    User.belongsToMany(models.Series, {
      through: 'UserSerie',
      foreignKey: 'userId'
    });
  };
  return User;
};