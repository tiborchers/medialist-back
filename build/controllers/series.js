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

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Series = _models2.default.Series,
    UserSerie = _models2.default.UserSerie,
    Genre = _models2.default.Genre,
    Season = _models2.default.Season,
    Episode = _models2.default.Episode,
    UserEpisode = _models2.default.UserEpisode,
    User = _models2.default.User;


var Op = _sequelize2.default.Op;

var Seriess = function () {
  function Seriess() {
    _classCallCheck(this, Seriess);
  }

  _createClass(Seriess, null, [{
    key: 'toWatch',
    value: function toWatch(req, res) {
      return req.user.then(function (user) {
        user.getSeries({
          include: [{
            model: Season,
            attributes: ['seasonNumber', 'initialDate', 'finalDate', 'id'],
            include: [{
              model: Episode,
              attributes: ['title', 'aired', 'id', 'episodeNumber'],
              include: [{
                model: User,
                attributes: ['id'],
                where: { id: user.id },
                through: {
                  attributes: ['id', 'consumed', 'consumedDate']
                },
                required: false
              }]
            }]
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }],
          order: [['initialYear', 'ASC'], ['title', 'ASC'], [Season, 'seasonNumber', 'ASC'], [Season, Episode, 'episodeNumber', 'ASC']],
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: 'To watch' }
          }
        }).then(function (series) {
          return res.status(200).send(series);
        });
      });
    }
  }, {
    key: 'getTotalWatched',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var user;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return req.user;

              case 2:
                user = _context.sent;
                return _context.abrupt('return', Series.findByPk(req.params.seriesId, {
                  include: [{
                    model: Season,
                    attributes: ['id'],
                    include: [{
                      model: Episode,
                      attributes: ['id'],
                      include: [{
                        model: User,
                        attributes: ['id'],
                        where: { id: user.id },
                        through: {
                          attributes: ['id', 'consumed', 'consumedDate']
                        },
                        required: false
                      }]
                    }]
                  }]
                }).then(function (series) {
                  if (!series) {
                    return res.status(404).send({
                      success: false,
                      message: 'Album Not Found'
                    });
                  }
                  var total = 0;
                  var watched = 0;
                  for (var i = 0; i < series.Seasons.length; i++) {
                    for (var j = 0; j < series.Seasons[i].Episodes.length; j++) {
                      if (series.Seasons[i].Episodes[j].Users.length > 0) {
                        if (series.Seasons[i].Episodes[j].Users[0].UserEpisode.consumed) {
                          watched += 1;
                        }
                      }
                      total += 1;
                    }
                  }
                  return res.status(200).send({
                    success: true,
                    message: 'Album retrieved',
                    total: total,
                    watched: watched
                  });
                }).catch(function (error) {
                  res.status(400).send({
                    success: false,
                    message: 'Wrong PK',
                    error: error
                  });
                }));

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getTotalWatched(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return getTotalWatched;
    }()
  }, {
    key: 'dropped',
    value: function dropped(req, res) {
      return req.user.then(function (user) {
        user.getSeries({
          include: [{
            model: Season,
            attributes: ['seasonNumber', 'initialDate', 'finalDate', 'id'],
            include: [{
              model: Episode,
              attributes: ['title', 'aired', 'id', 'episodeNumber'],
              include: [{
                model: User,
                attributes: ['id'],
                where: { id: user.id },
                through: {
                  attributes: ['id', 'consumed', 'consumedDate']
                },
                required: false
              }]
            }]
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }],
          order: [['initialYear', 'ASC'], ['title', 'ASC'], [Season, 'seasonNumber', 'ASC'], [Season, Episode, 'episodeNumber', 'ASC']],
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: 'Dropped' }
          }
        }).then(function (series) {
          return res.status(200).send(series);
        });
      });
    }
  }, {
    key: 'done',
    value: function done(req, res) {
      return req.user.then(function (user) {
        user.getSeries({
          include: [{
            model: Season,
            attributes: ['seasonNumber', 'initialDate', 'finalDate', 'id'],
            include: [{
              model: Episode,
              attributes: ['title', 'aired', 'id', 'episodeNumber'],
              include: [{
                model: User,
                attributes: ['id'],
                where: { id: user.id },
                through: {
                  attributes: ['id', 'consumed', 'consumedDate']
                },
                required: false
              }]
            }]
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }],
          order: [['initialYear', 'ASC'], ['title', 'ASC'], [Season, 'seasonNumber', 'ASC'], [Season, Episode, 'episodeNumber', 'ASC']],
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: 'Done' }
          }
        }).then(function (series) {
          return res.status(200).send(series);
        });
      });
    }
  }, {
    key: 'waitingForNewSeason',
    value: function waitingForNewSeason(req, res) {
      return req.user.then(function (user) {
        user.getSeries({
          include: [{
            model: Season,
            attributes: ['seasonNumber', 'initialDate', 'finalDate', 'id'],
            include: [{
              model: Episode,
              attributes: ['title', 'aired', 'id', 'episodeNumber'],
              include: [{
                model: User,
                attributes: ['id'],
                where: { id: user.id },
                through: {
                  attributes: ['id', 'consumed', 'consumedDate']
                },
                required: false
              }]
            }]
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }],
          order: [['initialYear', 'ASC'], ['title', 'ASC'], [Season, 'seasonNumber', 'ASC'], [Season, Episode, 'episodeNumber', 'ASC']],
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: 'Waiting for new season' }
          }
        }).then(function (series) {
          return res.status(200).send(series);
        });
      });
    }
  }, {
    key: 'watching',
    value: function watching(req, res) {
      return req.user.then(function (user) {
        user.getSeries({
          include: [{
            model: Season,
            attributes: ['seasonNumber', 'initialDate', 'finalDate', 'id'],
            include: [{
              model: Episode,
              attributes: ['title', 'aired', 'id', 'episodeNumber'],
              include: [{
                model: User,
                attributes: ['id'],
                where: { id: user.id },
                through: {
                  attributes: ['id', 'consumed', 'consumedDate']
                },
                required: false
              }]
            }]
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }],
          order: [['initialYear', 'ASC'], ['title', 'ASC'], [Season, 'seasonNumber', 'ASC'], [Season, Episode, 'episodeNumber', 'ASC']],
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: 'Watching' }
          }
        }).then(function (series) {
          return res.status(200).send(series);
        });
      });
    }
  }, {
    key: 'onHold',
    value: function onHold(req, res) {
      return req.user.then(function (user) {
        user.getSeries({
          include: [{
            model: Season,
            attributes: ['seasonNumber', 'initialDate', 'finalDate', 'id'],
            include: [{
              model: Episode,
              attributes: ['title', 'aired', 'id', 'episodeNumber'],
              include: [{
                model: User,
                attributes: ['id'],
                where: { id: user.id },
                through: {
                  attributes: ['id', 'consumed', 'consumedDate']
                },
                required: false
              }]
            }]
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }],
          order: [['initialYear', 'ASC'], ['title', 'ASC'], [Season, 'seasonNumber', 'ASC'], [Season, Episode, 'episodeNumber', 'ASC']],
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: 'On hold' }
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
            where: { state: 'To watch' }
          }
        }).then(function (series) {
          return res.status(200).send({ count: series.length });
        });
      });
    }
  }, {
    key: 'get',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        var user;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return req.user;

              case 2:
                user = _context2.sent;
                return _context2.abrupt('return', Series.findByPk(req.params.seriesId, {
                  include: [{
                    model: Season,
                    attributes: ['seasonNumber', 'initialDate', 'finalDate', 'id'],
                    include: [{
                      model: Episode,
                      attributes: ['title', 'aired', 'id', 'episodeNumber'],
                      include: [{
                        model: User,
                        attributes: ['id'],
                        where: { id: user.id },
                        through: {
                          attributes: ['id', 'consumed', 'consumedDate']
                        },
                        required: false
                      }]
                    }]
                  }, {
                    model: Genre,
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                  }],
                  order: [['initialYear', 'ASC'], ['title', 'ASC'], [Season, 'seasonNumber', 'ASC'], [Season, Episode, 'episodeNumber', 'ASC']]
                }).then(function (series) {
                  if (!series) {
                    return res.status(404).send({
                      success: false,
                      message: 'Album Not Found'
                    });
                  }
                  return res.status(200).send({
                    success: true,
                    message: 'Album retrieved',
                    series: series
                  });
                }).catch(function (error) {
                  res.status(400).send({
                    success: false,
                    message: 'Wrong PK',
                    error: error
                  });
                }));

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function get(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: 'delete',
    value: function _delete(req, res) {
      var _this = this;

      return req.user.then(function (user) {
        return Series.findByPk(req.params.seriesId).then(function () {
          var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(series) {
            var episodes;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (series) {
                      _context3.next = 2;
                      break;
                    }

                    return _context3.abrupt('return', res.status(400).send({
                      success: false,
                      message: 'Series Not Found'
                    }));

                  case 2:
                    _context3.next = 4;
                    return user.getEpisodes({
                      include: [{
                        model: Season,
                        attributes: ['id'],
                        include: [{
                          model: Series,
                          attributes: ['id'],
                          where: { id: series.id }
                        }]
                      }]
                    });

                  case 4:
                    episodes = _context3.sent;
                    _context3.next = 7;
                    return user.removeEpisodes(episodes);

                  case 7:
                    return _context3.abrupt('return', user.removeSeries(series).then(function () {
                      res.status(200).send({
                        success: true,
                        message: 'Series successfully deleted'
                      });
                    }));

                  case 8:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee3, _this);
          }));

          return function (_x5) {
            return _ref3.apply(this, arguments);
          };
        }()).catch(function (error) {
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
      return Series.findByPk(req.params.seriesId).then(function (album) {
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
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
        var _this2 = this;

        var url, execFile, pythonProcess;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                url = req.body.url;

                if (!(typeof url === 'undefined' || !url.includes('imdb.com/') && !url.includes('myanimelist.net/'))) {
                  _context8.next = 3;
                  break;
                }

                return _context8.abrupt('return', res.status(400).send({
                  success: false,
                  message: 'No url'
                }));

              case 3:
                execFile = require('child_process').execFile;
                pythonProcess = null;

                if (!url.includes('myanimelist.net/')) {
                  _context8.next = 11;
                  break;
                }

                _context8.next = 8;
                return execFile('python3', ['server/controllers/scripts/mal.py', url]);

              case 8:
                pythonProcess = _context8.sent;
                _context8.next = 14;
                break;

              case 11:
                _context8.next = 13;
                return execFile('python3', ['server/controllers/scripts/imdbtvseries.py', url]);

              case 13:
                pythonProcess = _context8.sent;

              case 14:
                pythonProcess.stdout.on('data', function (data) {
                  var _JSON$parse = JSON.parse(data.toString()),
                      image = _JSON$parse.image,
                      title = _JSON$parse.title,
                      initialYear = _JSON$parse.initialYear,
                      finalYear = _JSON$parse.finalYear,
                      durationOfEpisode = _JSON$parse.durationOfEpisode,
                      rating = _JSON$parse.rating,
                      genres = _JSON$parse.genres,
                      link = _JSON$parse.link,
                      seasons = _JSON$parse.seasons;

                  var nfy = finalYear;
                  if (finalYear === '') {
                    nfy = null;
                  }
                  return Series.findOrCreate({
                    where: {
                      title: title,
                      initialYear: initialYear
                    },
                    defaults: {
                      image: image,
                      finalYear: nfy,
                      durationOfEpisode: durationOfEpisode,
                      rating: rating,
                      link: link
                    }
                  }).then(function () {
                    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(_ref5) {
                      var _ref7 = _slicedToArray(_ref5, 2),
                          newSerie = _ref7[0],
                          createdSeries = _ref7[1];

                      var newSongs, i, newEpisodes, user;
                      return regeneratorRuntime.wrap(function _callee7$(_context7) {
                        while (1) {
                          switch (_context7.prev = _context7.next) {
                            case 0:
                              if (!createdSeries) {
                                _context7.next = 19;
                                break;
                              }

                              genres.map(function () {
                                var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(genre) {
                                  return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                    while (1) {
                                      switch (_context4.prev = _context4.next) {
                                        case 0:
                                          _context4.next = 2;
                                          return Genre.findOrCreate({
                                            where: { name: genre, isFor: 'Series' }
                                          }).then(function (_ref9) {
                                            var _ref10 = _slicedToArray(_ref9, 2),
                                                newGenre = _ref10[0],
                                                created = _ref10[1];

                                            return newSerie.addGenres(newGenre);
                                          });

                                        case 2:
                                        case 'end':
                                          return _context4.stop();
                                      }
                                    }
                                  }, _callee4, _this2);
                                }));

                                return function (_x9) {
                                  return _ref8.apply(this, arguments);
                                };
                              }());
                              newSongs = Object.keys(seasons).map(function () {
                                var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(newSeason) {
                                  return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                    while (1) {
                                      switch (_context5.prev = _context5.next) {
                                        case 0:
                                          return _context5.abrupt('return', Season.create(seasons[newSeason]));

                                        case 1:
                                        case 'end':
                                          return _context5.stop();
                                      }
                                    }
                                  }, _callee5, _this2);
                                }));

                                return function (_x10) {
                                  return _ref11.apply(this, arguments);
                                };
                              }());
                              _context7.next = 5;
                              return Promise.all(newSongs);

                            case 5:
                              newSongs = _context7.sent;
                              i = 0;

                            case 7:
                              if (!(i < Object.keys(seasons).length)) {
                                _context7.next = 17;
                                break;
                              }

                              newEpisodes = seasons[i + 1]['episodes'].map(function () {
                                var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(newEp) {
                                  return regeneratorRuntime.wrap(function _callee6$(_context6) {
                                    while (1) {
                                      switch (_context6.prev = _context6.next) {
                                        case 0:
                                          return _context6.abrupt('return', Episode.create(newEp));

                                        case 1:
                                        case 'end':
                                          return _context6.stop();
                                      }
                                    }
                                  }, _callee6, _this2);
                                }));

                                return function (_x11) {
                                  return _ref12.apply(this, arguments);
                                };
                              }());
                              _context7.next = 11;
                              return Promise.all(newEpisodes);

                            case 11:
                              newEpisodes = _context7.sent;
                              _context7.next = 14;
                              return newSongs[i].addEpisodes(newEpisodes);

                            case 14:
                              i++;
                              _context7.next = 7;
                              break;

                            case 17:
                              _context7.next = 19;
                              return newSerie.setSeasons(newSongs);

                            case 19:
                              _context7.next = 21;
                              return req.user;

                            case 21:
                              user = _context7.sent;
                              _context7.next = 24;
                              return user.addSeries(newSerie, {
                                through: { state: 'To watch' }
                              });

                            case 24:
                              return _context7.abrupt('return', res.status(201).send({
                                success: true,
                                message: 'Album successfully created',
                                newSerie: newSerie
                              }));

                            case 25:
                            case 'end':
                              return _context7.stop();
                          }
                        }
                      }, _callee7, _this2);
                    }));

                    return function (_x8) {
                      return _ref6.apply(this, arguments);
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

              case 16:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function createByUrl(_x6, _x7) {
        return _ref4.apply(this, arguments);
      }

      return createByUrl;
    }()
  }, {
    key: 'createByUrlFlask',
    value: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(req, res) {
        var _this3 = this;

        var url, result, success, _result, image, title, initialYear, finalYear, durationOfEpisode, rating, genres, link, seasons, nfy;

        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                url = req.body.url;

                if (!(typeof url === 'undefined' || !url.includes('imdb.com/') && !url.includes('myanimelist.net/'))) {
                  _context13.next = 3;
                  break;
                }

                return _context13.abrupt('return', res.status(400).send({
                  success: false,
                  message: 'No url'
                }));

              case 3:
                result = null;
                success = false;

                if (!url.includes('myanimelist.net/')) {
                  _context13.next = 10;
                  break;
                }

                _context13.next = 8;
                return _axios2.default.post('http://python-dot-jovial-branch-266213.appspot.com/mal', {
                  url: url
                }).then(function (res) {
                  result = res;
                  success = true;
                }).catch(function (err) {
                  result = err;
                });

              case 8:
                _context13.next = 12;
                break;

              case 10:
                _context13.next = 12;
                return _axios2.default.post('http://python-dot-jovial-branch-266213.appspot.com/imdbtvseries', {
                  url: url
                }).then(function (res) {
                  result = res;
                  success = true;
                }).catch(function (err) {
                  result = err;
                });

              case 12:
                if (success) {
                  _context13.next = 14;
                  break;
                }

                return _context13.abrupt('return', res.status(400).send({
                  success: false,
                  message: result.toString()
                }));

              case 14:
                _result = result, image = _result.image, title = _result.title, initialYear = _result.initialYear, finalYear = _result.finalYear, durationOfEpisode = _result.durationOfEpisode, rating = _result.rating, genres = _result.genres, link = _result.link, seasons = _result.seasons;
                nfy = finalYear;

                if (finalYear === '') {
                  nfy = null;
                }
                return _context13.abrupt('return', Series.findOrCreate({
                  where: {
                    title: title,
                    initialYear: initialYear
                  },
                  defaults: {
                    image: image,
                    finalYear: nfy,
                    durationOfEpisode: durationOfEpisode,
                    rating: rating,
                    link: link
                  }
                }).then(function () {
                  var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(_ref14) {
                    var _ref16 = _slicedToArray(_ref14, 2),
                        newSerie = _ref16[0],
                        createdSeries = _ref16[1];

                    var newSongs, i, newEpisodes, user;
                    return regeneratorRuntime.wrap(function _callee12$(_context12) {
                      while (1) {
                        switch (_context12.prev = _context12.next) {
                          case 0:
                            if (!createdSeries) {
                              _context12.next = 19;
                              break;
                            }

                            genres.map(function () {
                              var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(genre) {
                                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                                  while (1) {
                                    switch (_context9.prev = _context9.next) {
                                      case 0:
                                        _context9.next = 2;
                                        return Genre.findOrCreate({
                                          where: { name: genre, isFor: 'Series' }
                                        }).then(function (_ref18) {
                                          var _ref19 = _slicedToArray(_ref18, 2),
                                              newGenre = _ref19[0],
                                              created = _ref19[1];

                                          return newSerie.addGenres(newGenre);
                                        });

                                      case 2:
                                      case 'end':
                                        return _context9.stop();
                                    }
                                  }
                                }, _callee9, _this3);
                              }));

                              return function (_x15) {
                                return _ref17.apply(this, arguments);
                              };
                            }());
                            newSongs = Object.keys(seasons).map(function () {
                              var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(newSeason) {
                                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                                  while (1) {
                                    switch (_context10.prev = _context10.next) {
                                      case 0:
                                        return _context10.abrupt('return', Season.create(seasons[newSeason]));

                                      case 1:
                                      case 'end':
                                        return _context10.stop();
                                    }
                                  }
                                }, _callee10, _this3);
                              }));

                              return function (_x16) {
                                return _ref20.apply(this, arguments);
                              };
                            }());
                            _context12.next = 5;
                            return Promise.all(newSongs);

                          case 5:
                            newSongs = _context12.sent;
                            i = 0;

                          case 7:
                            if (!(i < Object.keys(seasons).length)) {
                              _context12.next = 17;
                              break;
                            }

                            newEpisodes = seasons[i + 1]['episodes'].map(function () {
                              var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(newEp) {
                                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                                  while (1) {
                                    switch (_context11.prev = _context11.next) {
                                      case 0:
                                        return _context11.abrupt('return', Episode.create(newEp));

                                      case 1:
                                      case 'end':
                                        return _context11.stop();
                                    }
                                  }
                                }, _callee11, _this3);
                              }));

                              return function (_x17) {
                                return _ref21.apply(this, arguments);
                              };
                            }());
                            _context12.next = 11;
                            return Promise.all(newEpisodes);

                          case 11:
                            newEpisodes = _context12.sent;
                            _context12.next = 14;
                            return newSongs[i].addEpisodes(newEpisodes);

                          case 14:
                            i++;
                            _context12.next = 7;
                            break;

                          case 17:
                            _context12.next = 19;
                            return newSerie.setSeasons(newSongs);

                          case 19:
                            _context12.next = 21;
                            return req.user;

                          case 21:
                            user = _context12.sent;
                            _context12.next = 24;
                            return user.addSeries(newSerie, {
                              through: { state: 'To watch' }
                            });

                          case 24:
                            return _context12.abrupt('return', res.status(201).send({
                              success: true,
                              message: 'Album successfully created',
                              newSerie: newSerie
                            }));

                          case 25:
                          case 'end':
                            return _context12.stop();
                        }
                      }
                    }, _callee12, _this3);
                  }));

                  return function (_x14) {
                    return _ref15.apply(this, arguments);
                  };
                }()).catch(function (error) {
                  if (!res._headerSent) {
                    return res.status(400).send({
                      success: false,
                      message: 'Album creation failed',
                      error: error
                    });
                  }
                }));

              case 18:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function createByUrlFlask(_x12, _x13) {
        return _ref13.apply(this, arguments);
      }

      return createByUrlFlask;
    }()
  }, {
    key: 'updateByUrl',
    value: function () {
      var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(req, res) {
        var _this4 = this;

        return regeneratorRuntime.wrap(function _callee19$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                return _context20.abrupt('return', Series.findByPk(req.params.seriesId).then(function () {
                  var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(series) {
                    var url, execFile, pythonProcess;
                    return regeneratorRuntime.wrap(function _callee18$(_context19) {
                      while (1) {
                        switch (_context19.prev = _context19.next) {
                          case 0:
                            url = series.link;

                            if (!(typeof url === 'undefined' || !url.includes('imdb.com/') && !url.includes('myanimelist.net/'))) {
                              _context19.next = 3;
                              break;
                            }

                            return _context19.abrupt('return', res.status(400).send({
                              success: false,
                              message: 'No url'
                            }));

                          case 3:
                            execFile = require('child_process').execFile;
                            pythonProcess = null;

                            if (!url.includes('myanimelist.net/')) {
                              _context19.next = 11;
                              break;
                            }

                            _context19.next = 8;
                            return execFile('python3', ['server/controllers/scripts/mal.py', url]);

                          case 8:
                            pythonProcess = _context19.sent;
                            _context19.next = 14;
                            break;

                          case 11:
                            _context19.next = 13;
                            return execFile('python3', ['server/controllers/scripts/imdbtvseries.py', url]);

                          case 13:
                            pythonProcess = _context19.sent;

                          case 14:
                            pythonProcess.stdout.on('data', function (data) {
                              var _JSON$parse2 = JSON.parse(data.toString()),
                                  image = _JSON$parse2.image,
                                  initialYear = _JSON$parse2.initialYear,
                                  finalYear = _JSON$parse2.finalYear,
                                  durationOfEpisode = _JSON$parse2.durationOfEpisode,
                                  rating = _JSON$parse2.rating,
                                  seasons = _JSON$parse2.seasons;

                              var nfy = finalYear;
                              if (finalYear === '') {
                                nfy = null;
                              }

                              return series.update({
                                image: image || series.image,
                                rating: rating || series.rating,
                                finalYear: nfy || series.finalYear,
                                durationOfEpisode: durationOfEpisode || series.durationOfEpisode,
                                initialYear: initialYear || series.initialYear
                              }).then(function () {
                                var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(newSeries) {
                                  var changes, newSongs, user, _loop, i;

                                  return regeneratorRuntime.wrap(function _callee17$(_context18) {
                                    while (1) {
                                      switch (_context18.prev = _context18.next) {
                                        case 0:
                                          changes = false;

                                          changes = newSeries.finalYear !== series.finalYear;
                                          newSongs = Object.keys(seasons).map(function () {
                                            var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(newSeason) {
                                              return regeneratorRuntime.wrap(function _callee14$(_context14) {
                                                while (1) {
                                                  switch (_context14.prev = _context14.next) {
                                                    case 0:
                                                      return _context14.abrupt('return', Season.findOrCreate({
                                                        where: {
                                                          seasonNumber: seasons[newSeason].seasonNumber,
                                                          seriesId: series.id
                                                        },
                                                        defaults: {
                                                          initialDate: seasons[newSeason].initialDate,
                                                          finalDate: seasons[newSeason].finalDate
                                                        }
                                                      }));

                                                    case 1:
                                                    case 'end':
                                                      return _context14.stop();
                                                  }
                                                }
                                              }, _callee14, _this4);
                                            }));

                                            return function (_x22) {
                                              return _ref25.apply(this, arguments);
                                            };
                                          }());
                                          _context18.next = 5;
                                          return Promise.all(newSongs);

                                        case 5:
                                          newSongs = _context18.sent;

                                          newSongs = newSongs.map(function (element) {
                                            changes = changes || element[1];
                                            return element[0];
                                          });
                                          newSongs = newSongs.map(function () {
                                            var _ref26 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(element, index) {
                                              return regeneratorRuntime.wrap(function _callee15$(_context15) {
                                                while (1) {
                                                  switch (_context15.prev = _context15.next) {
                                                    case 0:
                                                      return _context15.abrupt('return', element.update({
                                                        initialDate: seasons[Object.keys(seasons)[index]].initialDate,
                                                        finalDate: seasons[Object.keys(seasons)[index]].finalDate
                                                      }));

                                                    case 1:
                                                    case 'end':
                                                      return _context15.stop();
                                                  }
                                                }
                                              }, _callee15, _this4);
                                            }));

                                            return function (_x23, _x24) {
                                              return _ref26.apply(this, arguments);
                                            };
                                          }());
                                          _context18.next = 10;
                                          return Promise.all(newSongs);

                                        case 10:
                                          newSongs = _context18.sent;
                                          _context18.next = 13;
                                          return req.user;

                                        case 13:
                                          user = _context18.sent;
                                          _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(i) {
                                            var newEpisodes;
                                            return regeneratorRuntime.wrap(function _loop$(_context17) {
                                              while (1) {
                                                switch (_context17.prev = _context17.next) {
                                                  case 0:
                                                    newEpisodes = seasons[i + 1]['episodes'].map(function () {
                                                      var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(newEp) {
                                                        return regeneratorRuntime.wrap(function _callee16$(_context16) {
                                                          while (1) {
                                                            switch (_context16.prev = _context16.next) {
                                                              case 0:
                                                                return _context16.abrupt('return', Episode.findOrCreate({
                                                                  where: {
                                                                    episodeNumber: newEp.episodeNumber,
                                                                    seasonId: newSongs[i].id || null
                                                                  },
                                                                  defaults: {
                                                                    aired: newEp.aired || null,
                                                                    title: newEp.title
                                                                  }
                                                                }));

                                                              case 1:
                                                              case 'end':
                                                                return _context16.stop();
                                                            }
                                                          }
                                                        }, _callee16, _this4);
                                                      }));

                                                      return function (_x25) {
                                                        return _ref27.apply(this, arguments);
                                                      };
                                                    }());
                                                    _context17.next = 3;
                                                    return Promise.all(newEpisodes);

                                                  case 3:
                                                    newEpisodes = _context17.sent;

                                                    newEpisodes = newEpisodes.map(function (element) {
                                                      changes = changes || element[1];
                                                      return element[0];
                                                    });
                                                    newEpisodes = newEpisodes.map(function (element, index) {
                                                      element.update({
                                                        aired: seasons[i + 1]['episodes'][index].aired || element.aired,
                                                        title: seasons[i + 1]['episodes'][index].title || element.title
                                                      });
                                                    });
                                                    _context17.next = 8;
                                                    return Promise.all(newEpisodes);

                                                  case 8:
                                                    newEpisodes = _context17.sent;
                                                    _context17.next = 11;
                                                    return newSongs[i].addEpisodes(newEpisodes);

                                                  case 11:
                                                  case 'end':
                                                    return _context17.stop();
                                                }
                                              }
                                            }, _loop, _this4);
                                          });
                                          i = 0;

                                        case 16:
                                          if (!(i < Object.keys(seasons).length)) {
                                            _context18.next = 21;
                                            break;
                                          }

                                          return _context18.delegateYield(_loop(i), 't0', 18);

                                        case 18:
                                          i++;
                                          _context18.next = 16;
                                          break;

                                        case 21:
                                          _context18.next = 23;
                                          return newSeries.setSeasons(newSongs);

                                        case 23:
                                          if (!changes) {
                                            _context18.next = 26;
                                            break;
                                          }

                                          _context18.next = 26;
                                          return user.addSeries(newSeries, {
                                            through: { state: 'To watch' }
                                          });

                                        case 26:
                                          return _context18.abrupt('return', res.status(201).send({
                                            success: true,
                                            message: 'Album successfully created',
                                            newSeries: newSeries
                                          }));

                                        case 27:
                                        case 'end':
                                          return _context18.stop();
                                      }
                                    }
                                  }, _callee17, _this4);
                                }));

                                return function (_x21) {
                                  return _ref24.apply(this, arguments);
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

                          case 16:
                          case 'end':
                            return _context19.stop();
                        }
                      }
                    }, _callee18, _this4);
                  }));

                  return function (_x20) {
                    return _ref23.apply(this, arguments);
                  };
                }()));

              case 1:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee19, this);
      }));

      function updateByUrl(_x18, _x19) {
        return _ref22.apply(this, arguments);
      }

      return updateByUrl;
    }()
  }, {
    key: 'updateByUrlFlask',
    value: function () {
      var _ref28 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(req, res) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee25$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                return _context27.abrupt('return', Series.findByPk(req.params.seriesId).then(function () {
                  var _ref29 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(series) {
                    var url, result, success, _result2, image, initialYear, finalYear, durationOfEpisode, rating, seasons, nfy;

                    return regeneratorRuntime.wrap(function _callee24$(_context26) {
                      while (1) {
                        switch (_context26.prev = _context26.next) {
                          case 0:
                            url = series.link;

                            if (!(typeof url === 'undefined' || !url.includes('imdb.com/') && !url.includes('myanimelist.net/'))) {
                              _context26.next = 3;
                              break;
                            }

                            return _context26.abrupt('return', res.status(400).send({
                              success: false,
                              message: 'No url'
                            }));

                          case 3:
                            result = null;
                            success = false;

                            if (!url.includes('myanimelist.net/')) {
                              _context26.next = 10;
                              break;
                            }

                            _context26.next = 8;
                            return _axios2.default.post('http://python-dot-jovial-branch-266213.appspot.com/mal', {
                              url: url
                            }).then(function (res) {
                              result = res;
                              success = true;
                            }).catch(function (err) {
                              result = err;
                            });

                          case 8:
                            _context26.next = 12;
                            break;

                          case 10:
                            _context26.next = 12;
                            return _axios2.default.post('http://python-dot-jovial-branch-266213.appspot.com/imdbtvseries', {
                              url: url
                            }).then(function (res) {
                              result = res;
                            }).catch(function (err) {
                              result = err;
                            });

                          case 12:
                            if (success) {
                              _context26.next = 14;
                              break;
                            }

                            return _context26.abrupt('return', res.status(400).send({
                              success: false,
                              message: result.toString()
                            }));

                          case 14:
                            _result2 = result, image = _result2.image, initialYear = _result2.initialYear, finalYear = _result2.finalYear, durationOfEpisode = _result2.durationOfEpisode, rating = _result2.rating, seasons = _result2.seasons;
                            nfy = finalYear;

                            if (finalYear === '') {
                              nfy = null;
                            }

                            return _context26.abrupt('return', series.update({
                              image: image || series.image,
                              rating: rating || series.rating,
                              finalYear: nfy || series.finalYear,
                              durationOfEpisode: durationOfEpisode || series.durationOfEpisode,
                              initialYear: initialYear || series.initialYear
                            }).then(function () {
                              var _ref30 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(newSeries) {
                                var changes, newSongs, user, _loop2, i;

                                return regeneratorRuntime.wrap(function _callee23$(_context25) {
                                  while (1) {
                                    switch (_context25.prev = _context25.next) {
                                      case 0:
                                        changes = false;

                                        changes = newSeries.finalYear !== series.finalYear;
                                        newSongs = Object.keys(seasons).map(function () {
                                          var _ref31 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(newSeason) {
                                            return regeneratorRuntime.wrap(function _callee20$(_context21) {
                                              while (1) {
                                                switch (_context21.prev = _context21.next) {
                                                  case 0:
                                                    return _context21.abrupt('return', Season.findOrCreate({
                                                      where: {
                                                        seasonNumber: seasons[newSeason].seasonNumber,
                                                        seriesId: series.id
                                                      },
                                                      defaults: {
                                                        initialDate: seasons[newSeason].initialDate,
                                                        finalDate: seasons[newSeason].finalDate
                                                      }
                                                    }));

                                                  case 1:
                                                  case 'end':
                                                    return _context21.stop();
                                                }
                                              }
                                            }, _callee20, _this5);
                                          }));

                                          return function (_x30) {
                                            return _ref31.apply(this, arguments);
                                          };
                                        }());
                                        _context25.next = 5;
                                        return Promise.all(newSongs);

                                      case 5:
                                        newSongs = _context25.sent;

                                        newSongs = newSongs.map(function (element) {
                                          changes = changes || element[1];
                                          return element[0];
                                        });
                                        newSongs = newSongs.map(function () {
                                          var _ref32 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(element, index) {
                                            return regeneratorRuntime.wrap(function _callee21$(_context22) {
                                              while (1) {
                                                switch (_context22.prev = _context22.next) {
                                                  case 0:
                                                    return _context22.abrupt('return', element.update({
                                                      initialDate: seasons[Object.keys(seasons)[index]].initialDate,
                                                      finalDate: seasons[Object.keys(seasons)[index]].finalDate
                                                    }));

                                                  case 1:
                                                  case 'end':
                                                    return _context22.stop();
                                                }
                                              }
                                            }, _callee21, _this5);
                                          }));

                                          return function (_x31, _x32) {
                                            return _ref32.apply(this, arguments);
                                          };
                                        }());
                                        _context25.next = 10;
                                        return Promise.all(newSongs);

                                      case 10:
                                        newSongs = _context25.sent;
                                        _context25.next = 13;
                                        return req.user;

                                      case 13:
                                        user = _context25.sent;
                                        _loop2 = /*#__PURE__*/regeneratorRuntime.mark(function _loop2(i) {
                                          var newEpisodes;
                                          return regeneratorRuntime.wrap(function _loop2$(_context24) {
                                            while (1) {
                                              switch (_context24.prev = _context24.next) {
                                                case 0:
                                                  newEpisodes = seasons[i + 1]['episodes'].map(function () {
                                                    var _ref33 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(newEp) {
                                                      return regeneratorRuntime.wrap(function _callee22$(_context23) {
                                                        while (1) {
                                                          switch (_context23.prev = _context23.next) {
                                                            case 0:
                                                              return _context23.abrupt('return', Episode.findOrCreate({
                                                                where: {
                                                                  episodeNumber: newEp.episodeNumber,
                                                                  seasonId: newSongs[i].id || null
                                                                },
                                                                defaults: {
                                                                  aired: newEp.aired || null,
                                                                  title: newEp.title
                                                                }
                                                              }));

                                                            case 1:
                                                            case 'end':
                                                              return _context23.stop();
                                                          }
                                                        }
                                                      }, _callee22, _this5);
                                                    }));

                                                    return function (_x33) {
                                                      return _ref33.apply(this, arguments);
                                                    };
                                                  }());
                                                  _context24.next = 3;
                                                  return Promise.all(newEpisodes);

                                                case 3:
                                                  newEpisodes = _context24.sent;

                                                  newEpisodes = newEpisodes.map(function (element) {
                                                    changes = changes || element[1];
                                                    return element[0];
                                                  });
                                                  newEpisodes = newEpisodes.map(function (element, index) {
                                                    element.update({
                                                      aired: seasons[i + 1]['episodes'][index].aired || element.aired,
                                                      title: seasons[i + 1]['episodes'][index].title || element.title
                                                    });
                                                  });
                                                  _context24.next = 8;
                                                  return Promise.all(newEpisodes);

                                                case 8:
                                                  newEpisodes = _context24.sent;
                                                  _context24.next = 11;
                                                  return newSongs[i].addEpisodes(newEpisodes);

                                                case 11:
                                                case 'end':
                                                  return _context24.stop();
                                              }
                                            }
                                          }, _loop2, _this5);
                                        });
                                        i = 0;

                                      case 16:
                                        if (!(i < Object.keys(seasons).length)) {
                                          _context25.next = 21;
                                          break;
                                        }

                                        return _context25.delegateYield(_loop2(i), 't0', 18);

                                      case 18:
                                        i++;
                                        _context25.next = 16;
                                        break;

                                      case 21:
                                        _context25.next = 23;
                                        return newSeries.setSeasons(newSongs);

                                      case 23:
                                        if (!changes) {
                                          _context25.next = 26;
                                          break;
                                        }

                                        _context25.next = 26;
                                        return user.addSeries(newSeries, {
                                          through: { state: 'To watch' }
                                        });

                                      case 26:
                                        return _context25.abrupt('return', res.status(201).send({
                                          success: true,
                                          message: 'Album successfully created',
                                          newSeries: newSeries
                                        }));

                                      case 27:
                                      case 'end':
                                        return _context25.stop();
                                    }
                                  }
                                }, _callee23, _this5);
                              }));

                              return function (_x29) {
                                return _ref30.apply(this, arguments);
                              };
                            }()).catch(function (error) {
                              if (!res._headerSent) {
                                return res.status(400).send({
                                  success: false,
                                  message: 'Album creation failed',
                                  error: error
                                });
                              }
                            }));

                          case 18:
                          case 'end':
                            return _context26.stop();
                        }
                      }
                    }, _callee24, _this5);
                  }));

                  return function (_x28) {
                    return _ref29.apply(this, arguments);
                  };
                }()));

              case 1:
              case 'end':
                return _context27.stop();
            }
          }
        }, _callee25, this);
      }));

      function updateByUrlFlask(_x26, _x27) {
        return _ref28.apply(this, arguments);
      }

      return updateByUrlFlask;
    }()
  }, {
    key: 'watched',
    value: function watched(req, res) {
      var _this6 = this;

      return req.user.then(function (user) {
        Episode.findByPk(req.params.episodeId).then(function () {
          var _ref34 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(ep) {
            return regeneratorRuntime.wrap(function _callee26$(_context28) {
              while (1) {
                switch (_context28.prev = _context28.next) {
                  case 0:
                    user.addEpisode(ep, {
                      through: {
                        consumed: true,
                        consumedDate: Date.now()
                      }
                    }).then(function (updated) {
                      res.status(200).send({
                        success: true,
                        message: 'Episode updated successfully!',
                        updated: updated
                      });
                    }).catch(function (error) {
                      res.status(400).send({
                        success: true,
                        message: 'Episode updated successfully!',
                        error: error
                      });
                    });

                  case 1:
                  case 'end':
                    return _context28.stop();
                }
              }
            }, _callee26, _this6);
          }));

          return function (_x34) {
            return _ref34.apply(this, arguments);
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
    key: 'watchedNoStats',
    value: function watchedNoStats(req, res) {
      var _this7 = this;

      return req.user.then(function (user) {
        Episode.findByPk(req.params.episodeId).then(function () {
          var _ref35 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(ep) {
            return regeneratorRuntime.wrap(function _callee27$(_context29) {
              while (1) {
                switch (_context29.prev = _context29.next) {
                  case 0:
                    user.addEpisode(ep, {
                      through: {
                        consumed: true
                      }
                    }).then(function (updated) {
                      res.status(200).send({
                        success: true,
                        message: 'Episode updated successfully!',
                        updated: updated
                      });
                    }).catch(function (error) {
                      res.status(400).send({
                        success: true,
                        message: 'Episode updated successfully!',
                        error: error
                      });
                    });

                  case 1:
                  case 'end':
                    return _context29.stop();
                }
              }
            }, _callee27, _this7);
          }));

          return function (_x35) {
            return _ref35.apply(this, arguments);
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
    key: 'unWatched',
    value: function unWatched(req, res) {
      var _this8 = this;

      return req.user.then(function (user) {
        Episode.findByPk(req.params.episodeId).then(function () {
          var _ref36 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(ep) {
            return regeneratorRuntime.wrap(function _callee28$(_context30) {
              while (1) {
                switch (_context30.prev = _context30.next) {
                  case 0:
                    user.addEpisode(ep, {
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

                  case 1:
                  case 'end':
                    return _context30.stop();
                }
              }
            }, _callee28, _this8);
          }));

          return function (_x36) {
            return _ref36.apply(this, arguments);
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
    key: 'seriesChangeState',
    value: function seriesChangeState(req, res) {
      var _this9 = this;

      var state = req.body.state;

      return req.user.then(function (user) {
        Series.findByPk(req.params.seriesId).then(function () {
          var _ref37 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29(ep) {
            return regeneratorRuntime.wrap(function _callee29$(_context31) {
              while (1) {
                switch (_context31.prev = _context31.next) {
                  case 0:
                    user.addSeries(ep, {
                      through: {
                        state: state,
                        stateDate: Date.now()
                      }
                    }).then(function (updated) {
                      res.status(200).send({
                        success: true,
                        message: 'Album updated successfully',
                        updated: updated
                      });
                    });

                  case 1:
                  case 'end':
                    return _context31.stop();
                }
              }
            }, _callee29, _this9);
          }));

          return function (_x37) {
            return _ref37.apply(this, arguments);
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
    key: 'nuke',
    value: function () {
      var _ref38 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(req, res) {
        return regeneratorRuntime.wrap(function _callee30$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                _context32.next = 2;
                return Series.destroy({
                  where: {},
                  cascade: false
                }).catch(function (error) {
                  return res.status(400).send(error);
                });

              case 2:
                _context32.next = 4;
                return Episode.destroy({
                  where: {},
                  truncate: true,
                  cascade: false
                }).catch(function (error) {
                  return res.status(400).send(error);
                });

              case 4:
                _context32.next = 6;
                return Season.destroy({
                  where: {},
                  cascade: false
                }).catch(function (error) {
                  return res.status(400).send(error);
                });

              case 6:
                _context32.next = 8;
                return UserSerie.destroy({
                  where: {},
                  truncate: true,
                  cascade: false
                }).catch(function (error) {
                  return res.status(400).send(error);
                });

              case 8:
                _context32.next = 10;
                return UserEpisode.destroy({
                  where: {},
                  truncate: true,
                  cascade: false
                }).catch(function (error) {
                  return res.status(400).send(error);
                });

              case 10:
                return _context32.abrupt('return', res.status(200).send({
                  success: true,
                  message: 'Kaboom!'
                }));

              case 11:
              case 'end':
                return _context32.stop();
            }
          }
        }, _callee30, this);
      }));

      function nuke(_x38, _x39) {
        return _ref38.apply(this, arguments);
      }

      return nuke;
    }()
  }, {
    key: 'getEpisode',
    value: function getEpisode(req, res) {
      return req.user.then(function (user) {
        user.getEpisodes({
          include: [{
            model: Season,
            attributes: ['id', 'seasonNumber'],
            include: [{
              model: Series,
              attributes: ['image', 'title', 'durationOfEpisode']
            }]
          }],
          through: {
            where: { consumed: true, consumedDate: _defineProperty({}, Op.ne, null) },
            attributes: ['consumed', 'consumedDate']
          },
          raw: true
        }).then(function (episodes) {
          return res.status(200).send({ episodes: episodes });
        });
      });
    }
  }, {
    key: 'getEpisodeCount',
    value: function getEpisodeCount(req, res) {
      return req.user.then(function (user) {
        user.getEpisodes({
          include: [{
            model: Season,
            attributes: ['id'],
            include: [{
              model: Series,
              attributes: ['image', 'title', 'durationOfEpisode']
            }]
          }],
          through: {
            where: { consumed: true, consumedDate: _defineProperty({}, Op.not, null) },
            attributes: ['consumed', 'consumedDate']
          },
          raw: true
        }).then(function (episodes) {
          return res.status(200).send({ count: episodes.length });
        });
      });
    }
  }, {
    key: 'getEpisodeSum',
    value: function getEpisodeSum(req, res) {
      return req.user.then(function (user) {
        user.getEpisodes({
          include: [{
            model: Season,
            attributes: ['id'],
            include: [{
              model: Series,
              attributes: ['image', 'title', 'durationOfEpisode']
            }]
          }],
          through: {
            where: { consumed: true },
            attributes: ['consumed', 'consumedDate']
          },
          raw: true
        }).then(function (episodes) {
          var minutes = 0;
          for (var i = 0; i < episodes.length; i++) {
            console.log(episodes[i]);
            minutes += episodes[i]['Season.Series.durationOfEpisode'];
          }
          res.status(200).send({ minutes: minutes });
        });
      });
    }
  }, {
    key: 'getSuma',
    value: function () {
      var _ref39 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31(req, res) {
        return regeneratorRuntime.wrap(function _callee31$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                return _context33.abrupt('return', req.user.then(function (user) {
                  user.getSeries({
                    attributes: ['id', 'durationOfEpisode'],
                    include: [{
                      model: Season,
                      attributes: ['id'],
                      include: [{
                        model: Episode,
                        attributes: ['id'],
                        include: [{
                          model: User,
                          attributes: ['id'],
                          where: { id: user.id },
                          through: {
                            attributes: ['id', 'consumed', 'consumedDate'],
                            where: { consumed: true }
                          },
                          required: false
                        }]
                      }]
                    }],
                    through: {
                      where: {
                        state: _defineProperty({}, Op.or, ['To watch', 'Watching', 'Waiting for new season'])
                      }
                    }
                  }).then(function (series) {
                    var minutes = 0;
                    for (var i = 0; i < series.length; i++) {
                      for (var j = 0; j < series[i].Seasons.length; j++) {
                        for (var k = 0; k < series[i].Seasons[j].Episodes.length; k++) {
                          if (!series[i].Seasons[j].Episodes[k].Users.length) {
                            minutes += series[i].durationOfEpisode;
                          }
                        }
                      }
                    }
                    res.status(200).send({
                      minutes: minutes
                    });
                  });
                }));

              case 1:
              case 'end':
                return _context33.stop();
            }
          }
        }, _callee31, this);
      }));

      function getSuma(_x40, _x41) {
        return _ref39.apply(this, arguments);
      }

      return getSuma;
    }()
  }, {
    key: 'getCount',
    value: function () {
      var _ref40 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32(req, res) {
        return regeneratorRuntime.wrap(function _callee32$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                return _context34.abrupt('return', req.user.then(function (user) {
                  user.getSeries({
                    attributes: ['id', 'durationOfEpisode'],
                    include: [{
                      model: Season,
                      attributes: ['id'],
                      include: [{
                        model: Episode,
                        attributes: ['id'],
                        include: [{
                          model: User,
                          attributes: ['id'],
                          where: { id: user.id },
                          through: {
                            attributes: ['id', 'consumed', 'consumedDate'],
                            where: { consumed: true }
                          },
                          required: false
                        }]
                      }]
                    }],
                    through: {
                      where: {
                        state: _defineProperty({}, Op.or, ['To watch', 'Watching', 'Waiting for new season'])
                      }
                    }
                  }).then(function (series) {
                    var count = 0;
                    for (var i = 0; i < series.length; i++) {
                      for (var j = 0; j < series[i].Seasons.length; j++) {
                        for (var k = 0; k < series[i].Seasons[j].Episodes.length; k++) {
                          if (!series[i].Seasons[j].Episodes[k].Users.length) {
                            count += 1;
                          }
                        }
                      }
                    }
                    res.status(200).send({
                      count: count
                    });
                  });
                }));

              case 1:
              case 'end':
                return _context34.stop();
            }
          }
        }, _callee32, this);
      }));

      function getCount(_x42, _x43) {
        return _ref40.apply(this, arguments);
      }

      return getCount;
    }()
  }]);

  return Seriess;
}();

exports.default = Seriess;