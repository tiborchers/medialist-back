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

var Serie = _models2.default.Serie,
    UserSerie = _models2.default.UserSerie,
    Genre = _models2.default.Genre,
    Season = _models2.default.Season,
    Episode = _models2.default.Episode,
    UserEpisode = _models2.default.UserEpisode,
    User = _models2.default.User;


var Op = _sequelize2.default.Op;

var Series = function () {
  function Series() {
    _classCallCheck(this, Series);
  }

  _createClass(Series, null, [{
    key: 'toWatch',
    value: function toWatch(req, res) {
      return req.user.then(function (user) {
        user.getSeries({
          include: [{
            model: Seasons,
            include: [{
              model: Episodes
            }]
          }, {
            model: Genre,
            through: { attributes: [] }
          }],
          order: [['initialYear', 'ASC'], ['title', 'ASC']],
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: "To watch" }
          }
        }).then(function (series) {
          return res.status(200).send(series);
        });
      });
    }
  }, {
    key: 'toWatchCount',
    value: function toWatchCount(req, res) {
      return req.user.then(function (user) {
        user.getSeries({
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: "To watch" }
          }
        }).then(function (series) {
          return res.status(200).send({ count: series.length });
        });
      });
    }
  }, {
    key: 'get',
    value: function get(req, res) {
      return Series.findByPk(req.params.albumId, {
        include: [{
          model: Seasons,
          include: [{ model: Episodes }]
        }, {
          model: Genre,
          through: { attributes: [] }
        }]
      }).then(function (serie) {
        if (!serie) {
          return res.status(404).send({
            success: false,
            message: 'Album Not Found'
          });
        }
        return res.status(200).send({
          success: true,
          message: 'Album retrieved',
          serie: serie
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
    key: 'delete',
    value: function _delete(req, res) {
      return req.user.then(function (user) {
        return Series.findByPk(req.params.albumId).then(function (album) {
          if (!album) {
            return res.status(400).send({
              success: false,
              message: 'Album Not Found'
            });
          }
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
    key: 'deleteAdmin',
    value: function deleteAdmin(req, res) {
      return Series.findByPk(req.params.albumId).then(function (album) {
        if (!album) {
          return res.status(404).send({
            success: false,
            message: 'VideoGame Not Found'
          });
        }
        return album.destroy().then(function () {
          res.status(200).send({
            success: false,
            message: 'Album successfully deleted'
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
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
        var _this = this;

        var url, execFile, pythonProcess;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                url = req.body.url;

                if (!(typeof url === 'undefined' || !url.includes('imdb.com/'))) {
                  _context4.next = 3;
                  break;
                }

                return _context4.abrupt('return', res.status(400).send({
                  success: false,
                  message: 'No url'
                }));

              case 3:
                execFile = require('child_process').execFile;
                _context4.next = 6;
                return execFile('python', ['server/controllers/scripts/imdbtvseries.py', url]);

              case 6:
                pythonProcess = _context4.sent;

                pythonProcess.stdout.on('data', function (data) {
                  var _JSON$parse = JSON.parse(data.toString()),
                      image = _JSON$parse.image,
                      title = _JSON$parse.title,
                      initialYear = _JSON$parse.initialYear,
                      finalYear = _JSON$parse.finalYear,
                      durationOfEpisode = _JSON$parse.durationOfEpisode,
                      rating = _JSON$parse.rating,
                      genres = _JSON$parse.genres,
                      seasons = _JSON$parse.seasons;

                  return Series.findOrCreate({
                    where: {
                      title: title,
                      initialYear: initialYear
                    },
                    defaults: {
                      image: image,
                      finalYear: finalYear,
                      durationOfEpisode: durationOfEpisode,
                      rating: rating
                    }
                  }).then(function () {
                    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref2) {
                      var _ref4 = _slicedToArray(_ref2, 2),
                          newGM = _ref4[0],
                          createdShort = _ref4[1];

                      var GMId, user;
                      return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              if (!createdShort) {
                                _context3.next = 5;
                                break;
                              }

                              genres.map(function () {
                                var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(genre) {
                                  return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                      switch (_context.prev = _context.next) {
                                        case 0:
                                          _context.next = 2;
                                          return Genre.findOrCreate({
                                            where: { name: genre, isFor: 'Series' }
                                          }).then(function (_ref6) {
                                            var _ref7 = _slicedToArray(_ref6, 2),
                                                newGenre = _ref7[0],
                                                created = _ref7[1];

                                            return newGM.addSeries(newGenre);
                                          });

                                        case 2:
                                        case 'end':
                                          return _context.stop();
                                      }
                                    }
                                  }, _callee, _this);
                                }));

                                return function (_x4) {
                                  return _ref5.apply(this, arguments);
                                };
                              }());
                              GMId = newGM.id;
                              _context3.next = 5;
                              return Album.create({
                                duration: duration,
                                artist: artist,
                                numberOfSongs: numberOfSongs,
                                rating: rating,
                                GMId: GMId
                              }).then(function () {
                                var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(newAlbum) {
                                  var newSongs;
                                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                    while (1) {
                                      switch (_context2.prev = _context2.next) {
                                        case 0:
                                          newSongs = songs.map(function (newSong) {
                                            return Song.create(newSong);
                                          });
                                          _context2.next = 3;
                                          return Promise.all(newSongs);

                                        case 3:
                                          newSongs = _context2.sent;
                                          _context2.next = 6;
                                          return newAlbum.setSongs(newSongs);

                                        case 6:
                                        case 'end':
                                          return _context2.stop();
                                      }
                                    }
                                  }, _callee2, _this);
                                }));

                                return function (_x5) {
                                  return _ref8.apply(this, arguments);
                                };
                              }());

                            case 5:
                              _context3.next = 7;
                              return req.user;

                            case 7:
                              user = _context3.sent;
                              _context3.next = 10;
                              return user.addSeries(newGM);

                            case 10:
                              return _context3.abrupt('return', res.status(201).send({
                                success: true,
                                message: 'Album successfully created',
                                newGM: newGM
                              }));

                            case 11:
                            case 'end':
                              return _context3.stop();
                          }
                        }
                      }, _callee3, _this);
                    }));

                    return function (_x3) {
                      return _ref3.apply(this, arguments);
                    };
                  }()).catch(function (error) {
                    if (!res._headerSent) {
                      return res.status(400).send({
                        success: false,
                        message: 'Album creation failed',
                        error: error
                      });
                    }
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

      function createByUrl(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return createByUrl;
    }()
  }, {
    key: 'modify',
    value: function modify(req, res) {
      var _this2 = this;

      var _req$body = req.body,
          image = _req$body.image,
          title = _req$body.title,
          year = _req$body.year,
          commentary = _req$body.commentary,
          duration = _req$body.duration,
          numberOfSongs = _req$body.numberOfSongs,
          artist = _req$body.artist,
          rating = _req$body.rating;

      return Album.findByPk(req.params.albumId).then(function () {
        var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(album) {
          var gm;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  if (album) {
                    _context5.next = 2;
                    break;
                  }

                  return _context5.abrupt('return', res.status(404).send({
                    success: false,
                    message: 'Album Not Found'
                  }));

                case 2:
                  _context5.next = 4;
                  return album.getGenericMedium();

                case 4:
                  gm = _context5.sent;

                  gm.update({
                    image: image || gm.image,
                    title: title || gm.title,
                    year: year || gm.year,
                    commentary: commentary || gm.commentary
                  });
                  album.update({
                    duration: duration || album.duration,
                    rating: rating || album.rating,
                    artist: artist || album.artist,
                    numberOfSongs: numberOfSongs || album.numberOfSongs
                  }).then(function (updated) {
                    res.status(200).send({
                      success: false,
                      message: 'Album updated successfully',
                      data: {
                        duration: duration || album.duration,
                        rating: rating || album.rating,
                        artist: artist || album.artist,
                        image: image || gm.image,
                        title: title || gm.title,
                        year: year || gm.year,
                        commentary: commentary || gm.commentary
                      }
                    });
                  }).catch(function (error) {
                    return res.status(400).send({
                      success: false,
                      message: 'Album modification failed',
                      error: error
                    });
                  });

                case 7:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, _this2);
        }));

        return function (_x6) {
          return _ref9.apply(this, arguments);
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
    key: 'listened',
    value: function listened(req, res) {
      var _this3 = this;

      return req.user.then(function (user) {
        Album.findByPk(req.params.albumId).then(function () {
          var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(album) {
            var gm;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return album.getGenericMedium();

                  case 2:
                    gm = _context6.sent;

                    user.addGenericMedium(gm, {
                      through: {
                        consumed: true,
                        consumedDate: Date.now()
                      }
                    }).then(function (updated) {
                      res.status(200).send({
                        success: true,
                        message: 'Album updated successfully!',
                        updated: updated
                      });
                    }).catch(function (error) {
                      res.status(400).send({
                        success: true,
                        message: 'Album updated successfully!',
                        error: error
                      });
                    });

                  case 4:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, _callee6, _this3);
          }));

          return function (_x7) {
            return _ref10.apply(this, arguments);
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
    key: 'listenedDate',
    value: function listenedDate(req, res) {
      var _this4 = this;

      var date = req.body.date;

      return req.user.then(function (user) {
        Album.findByPk(req.params.albumId).then(function () {
          var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(album) {
            var gm;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return album.getGenericMedium();

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
                        message: 'Album updated successfully',
                        updated: updated
                      });
                    });

                  case 4:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, _callee7, _this4);
          }));

          return function (_x8) {
            return _ref11.apply(this, arguments);
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
    key: 'unListened',
    value: function unListened(req, res) {
      var _this5 = this;

      return req.user.then(function (user) {
        Album.findByPk(req.params.albumId).then(function () {
          var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(album) {
            var gm;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return album.getGenericMedium();

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
                        message: 'Album updated successfully',
                        updated: updated
                      });
                    });

                  case 4:
                  case 'end':
                    return _context8.stop();
                }
              }
            }, _callee8, _this5);
          }));

          return function (_x9) {
            return _ref12.apply(this, arguments);
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
      var _this6 = this;

      var genres = req.body.genres;

      Album.findByPk(req.params.albumId).then(function () {
        var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(album) {
          var GM, newGenres;
          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  if (album) {
                    _context9.next = 2;
                    break;
                  }

                  return _context9.abrupt('return', res.status(404).send({
                    success: false,
                    message: 'Album Not Found'
                  }));

                case 2:
                  _context9.next = 4;
                  return album.getGenericMedium();

                case 4:
                  GM = _context9.sent;
                  newGenres = genres.map(function (genre) {
                    return Genre.findOrCreate({
                      where: {
                        name: genre,
                        isFor: 'Album'
                      }
                    });
                  });
                  _context9.next = 8;
                  return Promise.all(newGenres);

                case 8:
                  newGenres = _context9.sent;

                  newGenres = newGenres.map(function (elem) {
                    return elem[0];
                  });
                  GM.setGenres(newGenres).then(function (data) {
                    res.status(200).send({
                      success: true,
                      message: 'Album genre change',
                      data: data
                    });
                  }).catch(function (error) {
                    res.status(400).send({
                      success: false,
                      message: 'Album modification failed',
                      error: error
                    });
                  });

                case 11:
                case 'end':
                  return _context9.stop();
              }
            }
          }, _callee9, _this6);
        }));

        return function (_x10) {
          return _ref13.apply(this, arguments);
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
    key: 'changeSongs',
    value: function changeSongs(req, res) {
      var _this7 = this;

      var songs = req.body.songs;

      Album.findByPk(req.params.albumId).then(function () {
        var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(album) {
          var newSongs;
          return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  if (album) {
                    _context10.next = 2;
                    break;
                  }

                  return _context10.abrupt('return', res.status(404).send({
                    success: false,
                    message: 'Album Not Found'
                  }));

                case 2:
                  newSongs = songs.map(function (song) {
                    return Song.findOrCreate({
                      where: {
                        title: song.title,
                        duration: song.duration,
                        trackNumber: song.trackNumber,
                        disc: song.disc,
                        AlbumId: album.id
                      }
                    });
                  });
                  _context10.next = 5;
                  return Promise.all(newSongs);

                case 5:
                  newSongs = _context10.sent;

                  newSongs = newSongs.map(function (elem) {
                    return elem[0];
                  });
                  album.setSongs(newSongs).then(function (data) {
                    res.status(200).send({
                      success: true,
                      message: 'Album songs change',
                      data: data
                    });
                  }).catch(function (error) {
                    res.status(400).send({
                      success: false,
                      message: 'Album modification failed',
                      error: error
                    });
                  });

                case 8:
                case 'end':
                  return _context10.stop();
              }
            }
          }, _callee10, _this7);
        }));

        return function (_x11) {
          return _ref14.apply(this, arguments);
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
    key: 'sumOfHours',
    value: function sumOfHours(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          includeIgnoreAttributes: false,
          include: [{
            model: Album,
            attributes: []
          }],
          where: _defineProperty({}, Op.not, [{ $Album$: null }]),
          through: {
            where: { consumed: false }
          },
          attributes: [[_sequelize2.default.fn('SUM', _sequelize2.default.col('Album.duration')), 'total']],
          raw: true
        }).then(function (albums) {
          return res.status(200).send({ albums: albums });
        });
      });
    }
  }]);

  return Series;
}();

exports.default = Series;