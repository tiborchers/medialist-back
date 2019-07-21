'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Genre = _models2.default.Genre;

var Genres = function () {
  function Genres() {
    _classCallCheck(this, Genres);
  }

  _createClass(Genres, null, [{
    key: 'Create',
    value: function Create(req, res) {
      var name = req.body.name;

      return Genre.findOrCreate({
        where: {
          name: name
        }
      }).then(function (GenreData) {
        res.status(201).send({
          success: true,
          message: 'Genre successfully created',
          GenreData: GenreData
        });
      }).then(function (error) {
        res.status(400).send({
          success: false,
          message: 'failed to create a genre',
          error: error
        });
      });
    }
  }, {
    key: 'listMovies',
    value: function listMovies(req, res) {
      return Genre.findAll({
        order: [['name', 'ASC']],
        where: {
          isFor: 'Movie'
        }
      }).then(function (genres) {
        res.status(200).send({
          success: true,
          message: 'List retrieved',
          genres: genres
        });
      });
    }
  }, {
    key: 'listShorts',
    value: function listShorts(req, res) {
      return Genre.findAll({
        order: [['name', 'ASC']],
        where: {
          isFor: 'Short'
        }
      }).then(function (genres) {
        res.status(200).send({
          success: true,
          message: 'List retrieved',
          genres: genres
        });
      });
    }
  }, {
    key: 'list',
    value: function list(req, res) {
      return Genre.findAll({
        order: [['name', 'ASC']]
      }).then(function (genres) {
        res.status(200).send({
          success: true,
          message: 'List retrieved',
          genres: genres
        });
      });
    }
  }, {
    key: 'listDocumentaries',
    value: function listDocumentaries(req, res) {
      return Genre.findAll({
        order: [['name', 'ASC']],
        where: {
          isFor: 'Documentary'
        }
      }).then(function (genres) {
        res.status(200).send({
          success: true,
          message: 'List retrieved',
          genres: genres
        });
      });
    }
  }, {
    key: 'listVideoGames',
    value: function listVideoGames(req, res) {
      return Genre.findAll({
        order: [['name', 'ASC']],
        where: {
          isFor: 'VideoGame'
        }
      }).then(function (genres) {
        res.status(200).send({
          success: true,
          message: 'List retrieved',
          genres: genres
        });
      });
    }
  }, {
    key: 'listBooks',
    value: function listBooks(req, res) {
      return Genre.findAll({
        order: [['name', 'ASC']],
        where: {
          isFor: 'Book'
        }
      }).then(function (genres) {
        res.status(200).send({
          success: true,
          message: 'List retrieved',
          genres: genres
        });
      });
    }
  }, {
    key: 'listAlbums',
    value: function listAlbums(req, res) {
      return Genre.findAll({
        order: [['name', 'ASC']],
        where: {
          isFor: 'Album'
        }
      }).then(function (genres) {
        res.status(200).send({
          success: true,
          message: 'List retrieved',
          genres: genres
        });
      });
    }
  }, {
    key: 'delete',
    value: function _delete(req, res) {
      return Genre.findByPk(req.params.genreId).then(function (genre) {
        if (!genre) {
          return res.status(400).send({
            success: false,
            message: 'Genre Not Found'
          });
        }
        return genre.destroy().then(function () {
          res.status(200).send({
            success: true,
            message: 'Genre successfully deleted'
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
          isFor = _req$body.isFor;

      return Genre.findByPk(req.params.genreId).then(function (genre) {
        genre.update({
          name: name || genre.name,
          isFor: isFor || genre.isFor
        }).then(function (updated) {
          res.status(200).send({
            message: 'Genre updated successfully',
            data: {
              name: name || genre.name,
              isFor: isFor || genre.isFor
            }
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

  return Genres;
}();

exports.default = Genres;