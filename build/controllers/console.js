'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Console = _models2.default.Console;

var Consoles = function () {
  function Consoles() {
    _classCallCheck(this, Consoles);
  }

  _createClass(Consoles, null, [{
    key: 'create',
    value: function create(req, res) {
      var name = req.body.name;

      return Console.findOrCreate({
        where: {
          name: name
        }
      }).then(function (ConsoleData) {
        res.status(201).send({
          success: true,
          message: 'Console successfully created',
          ConsoleData: ConsoleData
        });
      }).catch(function (error) {
        res.status(400).send({
          success: false,
          message: 'Error in console creation',
          error: error
        });
      });
    }
  }, {
    key: 'list',
    value: function list(req, res) {
      return Console.findAll({
        order: [['name', 'ASC']]
      }).then(function (consoles) {
        res.status(200).send({
          success: true,
          message: 'List retieved everything',
          consoles: consoles
        });
      });
    }
  }, {
    key: 'delete',
    value: function _delete(req, res) {
      return Console.findByPk(req.params.genreId).then(function (aConsole) {
        if (!aConsole) {
          return res.status(404).send({
            success: true,
            message: 'Console Not Found'
          });
        }
        return aConsole.destroy().then(function () {
          res.status(200).send({
            success: true,
            message: 'Console successfully deleted'
          });
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
    key: 'modify',
    value: function modify(req, res) {
      var _req$body = req.body,
          name = _req$body.name,
          image = _req$body.image,
          year = _req$body.year;

      return Console.findByPk(req.params.genreId).then(function (aConsole) {
        if (!aConsole) {
          return res.status(404).send({
            success: false,
            message: 'VideoGame Not Found'
          });
        }
        aConsole.update({
          name: name || aConsole.name,
          image: image || aConsole.image,
          year: year || aConsole.year
        }).then(function (updated) {
          res.status(200).send({
            success: true,
            message: 'Console updated successfully',
            data: {
              name: name || aConsole.name,
              image: image || aConsole.image,
              year: year || aConsole.year
            }
          });
        }).catch(function (error) {
          res.status(400).send({
            success: false,
            message: 'Error in updating the console',
            error: error
          });
        });
      }).catch(function (error) {
        res.status(400).send({
          success: false,
          message: 'Wrong PK',
          error: error
        });
      });
    }
  }]);

  return Consoles;
}();

exports.default = Consoles;