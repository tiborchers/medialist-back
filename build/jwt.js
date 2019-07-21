'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jwtOptions = exports.strategy = undefined;

var _models = require('./models');

var _models2 = _interopRequireDefault(_models);

var _passportJwt = require('passport-jwt');

var _passportJwt2 = _interopRequireDefault(_passportJwt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = _models2.default.User;


var ExtractJwt = _passportJwt2.default.ExtractJwt;
var JwtStrategy = _passportJwt2.default.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = '*ElmaxoOjoGato!#$';

var strategy = new JwtStrategy(jwtOptions, function (jwtPayload, next) {
  var user = User.findByPk(jwtPayload.id, {
    attributes: ['id', 'name', 'username', 'email']
  });
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

exports.strategy = strategy;
exports.jwtOptions = jwtOptions;