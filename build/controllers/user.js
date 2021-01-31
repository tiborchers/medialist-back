'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _jwt = require('../jwt');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = _models2.default.User;

var Users = function () {
  function Users() {
    _classCallCheck(this, Users);
  }

  _createClass(Users, null, [{
    key: 'get',
    value: function get(req, res) {
      return User.findByPk(req.params.id).then(function (user) {
        if (!user) {
          return res.status(400).send({
            success: true,
            message: 'User Not Found'
          });
        }
        return res.status(200).send({
          success: true,
          message: 'User retrieved',
          user: user
        });
      }).catch(function (error) {
        res.status(400).send({
          success: false,
          message: 'Wrong PK',
          error: error
        });
      });
    }
  }, {
    key: 'list',
    value: function list(req, res) {
      return User.findAll().then(function (users) {
        return res.status(200).send({
          success: true,
          message: 'User list retrieved',
          users: users
        });
      }).catch(function (error) {
        res.status(400).send({
          success: false,
          message: 'Error',
          error: error
        });
      });
    }
  }, {
    key: 'create',
    value: function create(req, res) {
      var _req$body = req.body,
          name = _req$body.name,
          username = _req$body.username,
          email = _req$body.email,
          password = _req$body.password;

      return User.create({
        name: name,
        username: username,
        email: email,
        password: password
      }, {}).then(function (newUser) {
        var payload = { id: newUser.id };
        var token = _jsonwebtoken2.default.sign(payload, _jwt.jwtOptions.secretOrKey, {
          expiresIn: '2w'
        });
        res.status(201).send({
          success: true,
          message: 'User successfully created',
          user: newUser,
          token: token
        });
      }).catch(function (error) {
        res.status(400).send({
          success: false,
          message: 'User creation failed',
          error: error
        });
      });
    }
  }, {
    key: 'login',
    value: function login(req, res) {
      var _this = this;

      var _req$body2 = req.body,
          email = _req$body2.email,
          password = _req$body2.password;

      return User.findOne({
        where: {
          email: email
        }
      }).then(function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (user) {
                    _context.next = 2;
                    break;
                  }

                  return _context.abrupt('return', res.status(401).send({
                    success: false,
                    message: 'Incorrect Email or password'
                  }));

                case 2:
                  user.comparePassword(password).then(function (match) {
                    if (match) {
                      var payload = { id: user.id };
                      var token = _jsonwebtoken2.default.sign(payload, _jwt.jwtOptions.secretOrKey, {
                        expiresIn: '2w'
                      });
                      var newUser = {
                        email: user.email,
                        username: user.username,
                        name: user.name
                      };
                      return res.status(200).send({ msg: 'ok', token: token, user: newUser });
                    } else {
                      return res.status(401).send({
                        success: false,
                        message: 'Incorrect Email or password'
                      });
                    }
                  });

                case 3:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }()).catch(function (error) {
        res.status(400).send({
          success: false,
          message: 'login failed',
          error: error
        });
      });
    }
  }, {
    key: 'renew',
    value: function renew(req, res) {
      return req.user.then(function (user) {
        var payload = { id: user.id };
        var token = _jsonwebtoken2.default.sign(payload, _jwt.jwtOptions.secretOrKey, {
          expiresIn: '2w'
        });
        return res.status(200).send({ msg: 'ok', token: token, user: user });
      });
    }
  }]);

  return Users;
}();

exports.default = Users;