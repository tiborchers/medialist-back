'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GenericMedia = _models2.default.GenericMedia,
    UserGM = _models2.default.UserGM;


var Op = _sequelize2.default.Op;

var GenericMedias = function () {
  function GenericMedias() {
    _classCallCheck(this, GenericMedias);
  }

  _createClass(GenericMedias, null, [{
    key: 'CreateGM',
    value: function CreateGM(req, res) {
      var _req$body = req.body,
          image = _req$body.image,
          title = _req$body.title,
          year = _req$body.year,
          commentary = _req$body.commentary;

      return GenericMedia.create({
        image: image,
        title: title,
        year: year,
        commentary: commentary
      }).then(function (GMData) {
        res.status(201).send({
          success: true,
          message: 'GM successfully created',
          GMData: GMData
        });
      });
    }
  }, {
    key: 'list',
    value: function list(req, res) {
      return GenericMedia.findAll({
        include: [GenericMedia.associations.Short, GenericMedia.associations.Movie, GenericMedia.associations.Documentary, GenericMedia.associations.VideoGame, GenericMedia.associations.Book]
      }).then(function (gm) {
        res.status(200).send({
          gm: gm,
          coutnt: gm.length
        });
      });
    }
  }, {
    key: 'delete',
    value: function _delete(req, res) {
      var _this = this;

      return GenericMedia.findByPk(req.params.gmId).then(function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(gm) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (gm) {
                    _context.next = 2;
                    break;
                  }

                  return _context.abrupt('return', res.status(400).send({
                    message: 'GenericMedia Not Found'
                  }));

                case 2:
                  _context.next = 4;
                  return gm.setUsers([]);

                case 4:
                  return _context.abrupt('return', gm.destroy().then(function () {
                    res.status(200).send({
                      message: 'GenericMedia successfully deleted'
                    });
                  }).catch(function (error) {
                    return res.status(400).send(error);
                  }));

                case 5:
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
        return res.status(400).send(error);
      });
    }
  }, {
    key: 'deleteNot',
    value: function deleteNot(req, res) {
      return GenericMedia.findAll({
        include: [GenericMedia.associations.Short, GenericMedia.associations.Movie, GenericMedia.associations.Documentary, GenericMedia.associations.VideoGame, GenericMedia.associations.Book, GenericMedia.associations.Album],
        where: _defineProperty({}, Op.and, [{ $Short$: null }, { $Movie$: null }, { $Documentary$: null }, { $VideoGame$: null }, { $Book$: null }, { $Album$: null }])
      }).then(function (gm) {
        return res.status(200).send(gm);
      });
    }
  }, {
    key: 'count',
    value: function count(req, res) {
      return GenericMedia.count().then(function (c) {
        return res.status(200).send({ c: c });
      });
    }
  }, {
    key: 'Cheking',
    value: function Cheking(req, res) {
      UserGM.findAll({
        where: _defineProperty({}, Op.or, [{ userId: null }, { GMId: null }])
      }).then(function (usergm) {
        res.status(200).send(usergm);
      });
    }
  }]);

  return GenericMedias;
}();

exports.default = GenericMedias;