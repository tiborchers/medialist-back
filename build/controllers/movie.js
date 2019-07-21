'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Movie = _models2.default.Movie,
    GenericMedia = _models2.default.GenericMedia,
    Genre = _models2.default.Genre,
    UserGM = _models2.default.UserGM,
    User = _models2.default.User;


var Op = _sequelize2.default.Op;

var Movies = function () {
  function Movies() {
    _classCallCheck(this, Movies);
  }

  _createClass(Movies, null, [{
    key: 'create',
    value: function create(req, res) {
      var _this = this;

      var _req$res = req.res,
          image = _req$res.image,
          title = _req$res.title,
          year = _req$res.year,
          commentary = _req$res.commentary,
          duration = _req$res.duration,
          rating = _req$res.rating,
          genres = _req$res.genres;

      return GenericMedia.findOrCreate({
        where: {
          title: title,
          year: year
        },
        defaults: {
          image: image,
          commentary: commentary
        }
      }).then(function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
          var _ref3 = _slicedToArray(_ref, 2),
              newGM = _ref3[0],
              createdMovie = _ref3[1];

          var GMId, user;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (createdMovie) {
                    genres.map(function (genre) {
                      Genre.findOrCreate({
                        where: { name: genre, isFor: 'Movie' }
                      }).then(function (_ref4) {
                        var _ref5 = _slicedToArray(_ref4, 2),
                            newGenre = _ref5[0],
                            created = _ref5[1];

                        newGM.addGenre(newGenre);
                      });
                    });
                    GMId = newGM.id;

                    Movie.create({ duration: duration, rating: rating, GMId: GMId });
                  }

                  _context.next = 3;
                  return req.user;

                case 3:
                  user = _context.sent;
                  _context.next = 6;
                  return user.addGenericMedium(newGM);

                case 6:
                  res.status(201).send({
                    success: true,
                    message: 'Movie successfully created',
                    newGM: newGM
                  });

                case 7:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this);
        }));

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }()).catch(function (error) {
        res.status(400).send({
          success: false,
          message: 'Movie creation failed',
          error: error
        });
      });
    }
  }, {
    key: 'createAdmin',
    value: function createAdmin(req, res) {
      var _this2 = this;

      var _req$body = req.body,
          image = _req$body.image,
          title = _req$body.title,
          year = _req$body.year,
          commentary = _req$body.commentary,
          duration = _req$body.duration,
          rating = _req$body.rating,
          genres = _req$body.genres;

      return req.user.then(function (user) {
        if (!user.admin) {
          return res.status(401).send({ message: 'NOPE' });
        }
        return Movie.create({
          duration: duration,
          rating: rating,
          GenericMedium: {
            image: image,
            title: title,
            year: year,
            commentary: commentary
          }
        }, {
          include: [{
            association: Movie.associations.GenericMedium
          }]
        }).then(function () {
          var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(newMovie) {
            var GM;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return newMovie.getGenericMedium();

                  case 2:
                    GM = _context2.sent;

                    genres.map(function (genre) {
                      Genre.findOrCreate({
                        where: { name: genre, isFor: 'Movie' }
                      }).then(function (_ref7) {
                        var _ref8 = _slicedToArray(_ref7, 2),
                            newGenre = _ref8[0],
                            created = _ref8[1];

                        GM.addGenre(newGenre);
                      });
                    });
                    res.status(201).send({
                      success: true,
                      message: 'Movie successfully created',
                      newMovie: newMovie
                    });

                  case 5:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, _this2);
          }));

          return function (_x2) {
            return _ref6.apply(this, arguments);
          };
        }()).catch(function (error) {
          res.status(400).send({
            success: false,
            message: 'Movie creation failed',
            error: error
          });
        });
      });
    }
  }, {
    key: 'getMoviesToWatch',
    value: function getMoviesToWatch(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          include: [{
            model: Movie,
            attributes: ['id', 'rating', 'duration']
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }],
          order: [['year', 'ASC'], ['title', 'ASC']],
          where: _defineProperty({}, Op.not, [{ $Movie$: null }]),
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        }).then(function (movies) {
          return res.status(200).send(movies);
        });
      });
    }
  }, {
    key: 'getMoviesWatched',
    value: function getMoviesWatched(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          include: [{
            model: Movie,
            attributes: ['id', 'rating', 'duration']
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }, {
            model: User,
            attributes: []
          }],
          order: [[User, UserGM, 'consumedDate', 'ASC']],
          where: _defineProperty({}, Op.not, [{ $Movie$: null }]),
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: true }
          }
        }).then(function (movies) {
          return res.status(200).send(movies);
        });
      });
    }
  }, {
    key: 'getMoviesCount',
    value: function getMoviesCount(req, res) {
      console.log('no');
      return req.user.then(function (user) {
        user.getGenericMedia({
          include: [{
            model: Movie,
            attributes: ['id', 'rating', 'duration']
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }],
          order: [['year', 'ASC'], ['title', 'ASC']],
          where: _defineProperty({}, Op.not, [{ $Movie$: null }]),
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        }).then(function (movies) {
          return res.status(200).send({ count: movies.length });
        });
      });
    }
  }, {
    key: 'getMoviesSum',
    value: function getMoviesSum(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          includeIgnoreAttributes: false,
          include: [{
            model: Movie,
            attributes: []
          }],
          where: _defineProperty({}, Op.not, [{ $Movie$: null }]),
          through: {
            where: { consumed: false }
          },
          attributes: [[_sequelize2.default.fn('SUM', _sequelize2.default.col('Movie.duration')), 'total']],
          raw: true
        }).then(function (movies) {
          return res.status(200).send({ movies: movies });
        });
      });
    }
  }, {
    key: 'list',
    value: function list(req, res) {
      return req.user.then(function (user) {
        if (!user.admin) {
          return res.status(401).send({ message: 'NOPE' });
        }
        return Movie.findAll({
          include: [{
            model: GenericMedia,
            attributes: ['image', 'title', 'year', 'consumed', 'commentary', 'consumedDate'],
            include: [{
              model: Genre,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }]
          }],
          attributes: ['id', 'duration', 'rating']
        }).then(function (movies) {
          res.status(200).send({
            success: true,
            message: 'Movie count successull',
            movies: movies
          });
        });
      });
    }
  }, {
    key: 'get',
    value: function get(req, res) {
      return Movie.findByPk(req.params.movieId, {
        include: [{
          model: GenericMedia,
          include: [{ model: Genre }]
        }]
      }).then(function (movie) {
        if (!movie) {
          return res.status(400).send({
            success: true,
            message: 'Movie Not Found'
          });
        }
        return res.status(200).send({
          success: true,
          message: 'Movie retrieved',
          movie: movie
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
    key: 'deleteAdmin',
    value: function deleteAdmin(req, res) {
      return req.user.then(function (user) {
        if (!user.admin) {
          return res.status(401).send({ message: 'NOPE' });
        }
        return Movie.findByPk(req.params.movieId).then(function (movie) {
          if (!movie) {
            return res.status(400).send({
              success: false,
              message: 'Movie Not Found'
            });
          }
          GenericMedia.findByPk(movie.GMId).then(function (gm) {
            gm.destroy();
          });
          return movie.destroy().then(function () {
            res.status(200).send({
              success: true,
              message: 'Movie successfully deleted'
            });
          });
        }).catch(function (error) {
          res.status(400).send({
            success: false,
            message: 'Wrong PK',
            error: error
          });
        });
      });
    }
  }, {
    key: 'delete',
    value: function _delete(req, res) {
      return req.user.then(function (user) {
        return Movie.findByPk(req.params.movieId).then(function (movie) {
          if (!movie) {
            return res.status(400).send({
              success: false,
              message: 'Movie Not Found'
            });
          }
          GenericMedia.findByPk(movie.GMId).then(function (gm) {
            return user.removeGenericMedium(gm).then(function () {
              res.status(200).send({
                success: true,
                message: 'Movie successfully deleted'
              });
            });
          });
        }).catch(function (error) {
          res.status(400).send({
            success: false,
            message: 'Wrong PK',
            error: error
          });
        });
      });
    }
  }, {
    key: 'createByUrl',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
        var _this3 = this;

        var url, spawn, pythonProcess;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                url = req.body.url;

                if (!(typeof url === 'undefined' || !url.includes('imdb.com/title/'))) {
                  _context4.next = 3;
                  break;
                }

                return _context4.abrupt('return', res.status(400).send({
                  success: false,
                  message: 'No url'
                }));

              case 3:
                spawn = require('child_process').spawn;
                _context4.next = 6;
                return spawn('python', ['server/controllers/scripts/imdb.py', url]);

              case 6:
                pythonProcess = _context4.sent;

                pythonProcess.stdout.on('data', function (data) {
                  var _JSON$parse = JSON.parse(data.toString()),
                      image = _JSON$parse.image,
                      title = _JSON$parse.title,
                      year = _JSON$parse.year,
                      commentary = _JSON$parse.commentary,
                      duration = _JSON$parse.duration,
                      rating = _JSON$parse.rating,
                      genres = _JSON$parse.genres;

                  return GenericMedia.findOrCreate({
                    where: {
                      title: title,
                      year: year
                    },
                    defaults: {
                      image: image,
                      commentary: commentary
                    }
                  }).then(function () {
                    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref10) {
                      var _ref12 = _slicedToArray(_ref10, 2),
                          newGM = _ref12[0],
                          createdMovie = _ref12[1];

                      var GMId, user;
                      return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              if (createdMovie) {
                                genres.map(function (genre) {
                                  Genre.findOrCreate({
                                    where: { name: genre, isFor: 'Movie' }
                                  }).then(function (_ref13) {
                                    var _ref14 = _slicedToArray(_ref13, 2),
                                        newGenre = _ref14[0],
                                        created = _ref14[1];

                                    newGM.addGenre(newGenre);
                                  });
                                });
                                GMId = newGM.id;

                                Movie.create({ duration: duration, rating: rating, GMId: GMId });
                              }

                              _context3.next = 3;
                              return req.user;

                            case 3:
                              user = _context3.sent;
                              _context3.next = 6;
                              return user.addGenericMedium(newGM);

                            case 6:
                              res.status(201).send({
                                success: true,
                                message: 'Movie successfully created',
                                newGM: newGM
                              });

                            case 7:
                            case 'end':
                              return _context3.stop();
                          }
                        }
                      }, _callee3, _this3);
                    }));

                    return function (_x5) {
                      return _ref11.apply(this, arguments);
                    };
                  }()).catch(function (error) {
                    res.status(400).send({
                      success: false,
                      message: 'Movie creation failed',
                      error: error
                    });
                  });
                });
                pythonProcess.stderr.on('data', function (data) {
                  if (!res._headerSent) {
                    return res.status(400).send({
                      success: false,
                      message: data.toString()
                    });
                  }
                });

              case 9:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function createByUrl(_x3, _x4) {
        return _ref9.apply(this, arguments);
      }

      return createByUrl;
    }()
  }, {
    key: 'modify',
    value: function modify(req, res) {
      var _this4 = this;

      var _req$body2 = req.body,
          image = _req$body2.image,
          title = _req$body2.title,
          year = _req$body2.year,
          commentary = _req$body2.commentary,
          duration = _req$body2.duration,
          rating = _req$body2.rating;

      return Movie.findByPk(req.params.movieId).then(function () {
        var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(movie) {
          var gm;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return movie.getGenericMedium();

                case 2:
                  gm = _context5.sent;

                  gm.update({
                    image: image || gm.image,
                    title: title || gm.title,
                    year: year || gm.year,
                    commentary: commentary || gm.commentary
                  });
                  movie.update({
                    duration: duration || movie.duration,
                    rating: rating || movie.rating
                  }).then(function (updated) {
                    res.status(200).send({
                      success: true,
                      message: 'Movie updated successfully',
                      data: {
                        duration: duration || movie.duration,
                        rating: rating || movie.rating,
                        image: image || gm.image,
                        title: title || gm.title,
                        year: year || gm.year,
                        commentary: commentary || gm.commentary
                      }
                    });
                  }).catch(function (error) {
                    res.status(400).send({
                      success: false,
                      message: 'Movie modification failed',
                      error: error
                    });
                  });

                case 5:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, _this4);
        }));

        return function (_x6) {
          return _ref15.apply(this, arguments);
        };
      }()).catch(function (error) {
        res.status(400).send({
          success: false,
          message: 'Wrong PK',
          error: error
        });
      });
    }
  }, {
    key: 'watched',
    value: function watched(req, res) {
      var _this5 = this;

      return req.user.then(function (user) {
        Movie.findByPk(req.params.movieId).then(function () {
          var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(movie) {
            var gm;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return movie.getGenericMedium();

                  case 2:
                    gm = _context6.sent;

                    user.addGenericMedium(gm, {
                      through: {
                        consumed: true,
                        consumedDate: Date.now()
                      }
                    }).then(function (updated) {
                      console.log(updated);
                      res.status(200).send({
                        success: true,
                        message: 'Movie updated successfully!',
                        updated: updated
                      });
                    }).catch(function (error) {
                      res.status(400).send({
                        success: true,
                        message: 'Movie updated successfully!',
                        error: error
                      });
                    });

                  case 4:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, _callee6, _this5);
          }));

          return function (_x7) {
            return _ref16.apply(this, arguments);
          };
        }()).catch(function (error) {
          res.status(400).send({
            success: false,
            error: error
          });
        });
      });
    }
  }, {
    key: 'watchedDate',
    value: function watchedDate(req, res) {
      var _this6 = this;

      var date = req.body.date;

      return req.user.then(function (user) {
        Movie.findByPk(req.params.movieId).then(function () {
          var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(movie) {
            var gm;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return movie.getGenericMedium();

                  case 2:
                    gm = _context7.sent;

                    user.addGenericMedium(gm, {
                      through: {
                        consumed: true,
                        consumedDate: new Date(date)
                      }
                    }).then(function (updated) {
                      res.status(200).send({
                        success: true,
                        message: 'Movie updated successfully',
                        updated: updated
                      });
                    });

                  case 4:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, _callee7, _this6);
          }));

          return function (_x8) {
            return _ref17.apply(this, arguments);
          };
        }()).catch(function (error) {
          res.status(400).send({
            success: false,
            error: error
          });
        });
      });
    }
  }, {
    key: 'unwatched',
    value: function unwatched(req, res) {
      var _this7 = this;

      return req.user.then(function (user) {
        Movie.findByPk(req.params.movieId).then(function () {
          var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(movie) {
            var gm;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return movie.getGenericMedium();

                  case 2:
                    gm = _context8.sent;

                    user.addGenericMedium(gm, {
                      through: {
                        consumed: false,
                        consumedDate: null
                      }
                    }).then(function (updated) {
                      res.status(200).send({
                        success: true,
                        message: 'Movie updated successfully',
                        updated: updated
                      });
                    });

                  case 4:
                  case 'end':
                    return _context8.stop();
                }
              }
            }, _callee8, _this7);
          }));

          return function (_x9) {
            return _ref18.apply(this, arguments);
          };
        }()).catch(function (error) {
          res.status(400).send({
            success: false,
            error: error
          });
        });
      });
    }
  }, {
    key: 'changeGenres',
    value: function changeGenres(req, res) {
      var _this8 = this;

      var genres = req.body.genres;

      Movie.findByPk(req.params.movieId).then(function () {
        var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(movie) {
          var GM, newGenres;
          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  _context9.next = 2;
                  return movie.getGenericMedium();

                case 2:
                  GM = _context9.sent;
                  newGenres = genres.map(function (genre) {
                    return Genre.findOrCreate({
                      where: { name: genre, isFor: 'Movie' }
                    });
                  });
                  _context9.next = 6;
                  return Promise.all(newGenres);

                case 6:
                  newGenres = _context9.sent;

                  newGenres = newGenres.map(function (elem) {
                    return elem[0];
                  });
                  GM.setGenres(newGenres).then(function (data) {
                    res.status(200).send({
                      success: true,
                      message: 'Movies genres changed',
                      data: data
                    });
                  }).catch(function (error) {
                    res.status(400).send({
                      success: false,
                      message: 'Failed to change genres',
                      error: error
                    });
                  });

                case 9:
                case 'end':
                  return _context9.stop();
              }
            }
          }, _callee9, _this8);
        }));

        return function (_x10) {
          return _ref19.apply(this, arguments);
        };
      }()).catch(function (error) {
        res.status(400).send({
          success: false,
          message: 'Wrong PK',
          error: error
        });
      });
    }
  }]);

  return Movies;
}();

exports.default = Movies;