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

var VideoGame = _models2.default.VideoGame,
    GenericMedia = _models2.default.GenericMedia,
    Genre = _models2.default.Genre,
    Console = _models2.default.Console,
    User = _models2.default.User,
    UserGM = _models2.default.UserGM;


var Op = _sequelize2.default.Op;

var VideoGames = function () {
  function VideoGames() {
    _classCallCheck(this, VideoGames);
  }

  _createClass(VideoGames, null, [{
    key: 'create',
    value: function create(req, res) {
      var _this = this;

      var _req$body = req.body,
          image = _req$body.image,
          title = _req$body.title,
          year = _req$body.year,
          commentary = _req$body.commentary,
          HLTB = _req$body.HLTB,
          developer = _req$body.developer,
          rating = _req$body.rating,
          genres = _req$body.genres,
          consoles = _req$body.consoles;

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
              createdShort = _ref3[1];

          var GMId, user;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!createdShort) {
                    _context.next = 5;
                    break;
                  }

                  genres.map(function (genre) {
                    Genre.findOrCreate({
                      where: { name: genre, isFor: 'VideoGame' }
                    }).then(function (_ref4) {
                      var _ref5 = _slicedToArray(_ref4, 2),
                          newGenre = _ref5[0],
                          created = _ref5[1];

                      newGM.addGenre(newGenre);
                    });
                  });
                  GMId = newGM.id;
                  _context.next = 5;
                  return VideoGame.create({ HLTB: HLTB, developer: developer, rating: rating, GMId: GMId }).then(function (newVideoGame) {
                    consoles.map(function (aConsole) {
                      Console.findOrCreate({
                        where: {
                          name: aConsole
                        }
                      }).then(function (_ref6) {
                        var _ref7 = _slicedToArray(_ref6, 2),
                            created = _ref7[0],
                            found = _ref7[1];

                        newVideoGame.addConsole(created);
                      });
                    });
                  });

                case 5:
                  _context.next = 7;
                  return req.user;

                case 7:
                  user = _context.sent;
                  _context.next = 10;
                  return user.addGenericMedium(newGM);

                case 10:
                  res.status(201).send({
                    success: true,
                    message: 'VideoGame successfully created',
                    newGM: newGM
                  });

                case 11:
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
          message: 'VideoGame creation failed',
          error: error
        });
      });
    }
  }, {
    key: 'createAdmin',
    value: function createAdmin(req, res) {
      var _this2 = this;

      var _req$body2 = req.body,
          image = _req$body2.image,
          title = _req$body2.title,
          year = _req$body2.year,
          commentary = _req$body2.commentary,
          HLTB = _req$body2.HLTB,
          developer = _req$body2.developer,
          rating = _req$body2.rating,
          genres = _req$body2.genres,
          consoles = _req$body2.consoles;

      return VideoGame.create({
        HLTB: HLTB,
        developer: developer,
        rating: rating,
        GenericMedium: {
          image: image,
          title: title,
          year: year,
          commentary: commentary
        }
      }, {
        include: [{
          association: VideoGame.associations.GenericMedium
        }]
      }).then(function () {
        var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(newVideoGame) {
          var GM;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return newVideoGame.getGenericMedium();

                case 2:
                  GM = _context2.sent;

                  genres.map(function (genre) {
                    Genre.findOrCreate({
                      where: {
                        name: genre,
                        isFor: 'VideoGame'
                      }
                    }).then(function (_ref9) {
                      var _ref10 = _slicedToArray(_ref9, 2),
                          created = _ref10[0],
                          found = _ref10[1];

                      GM.addGenre(created);
                    });
                  });
                  consoles.map(function (aConsole) {
                    Console.findOrCreate({
                      where: {
                        name: aConsole
                      }
                    }).then(function (_ref11) {
                      var _ref12 = _slicedToArray(_ref11, 2),
                          created = _ref12[0],
                          found = _ref12[1];

                      newVideoGame.addConsole(created);
                    });
                  });
                  res.status(201).send({
                    success: true,
                    message: 'Video Game successfully created',
                    newVideoGame: newVideoGame
                  });

                case 6:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this2);
        }));

        return function (_x2) {
          return _ref8.apply(this, arguments);
        };
      }()).catch(function (error) {
        res.status(400).send({
          success: false,
          message: 'Video Game creation failed',
          error: error
        });
      });
    }
  }, {
    key: 'toPlay',
    value: function toPlay(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          include: [{
            model: VideoGame,
            attributes: ['id', 'rating', 'HLTB', 'developer'],
            include: [{
              model: Console,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }]
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }],
          order: [['year', 'ASC'], ['title', 'ASC']],
          where: _defineProperty({}, Op.not, [{ $VideoGame$: null }]),
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        }).then(function (videogames) {
          return res.status(200).send(videogames);
        });
      });
    }
  }, {
    key: 'toPlayCount',
    value: function toPlayCount(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          include: [{
            model: VideoGame
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }],
          order: [['year', 'ASC'], ['title', 'ASC']],
          where: _defineProperty({}, Op.not, [{ $VideoGame$: null }]),
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        }).then(function (videogames) {
          return res.status(200).send({ count: videogames.length });
        });
      });
    }
  }, {
    key: 'playedCount',
    value: function playedCount(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          include: [{
            model: VideoGame
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }],
          order: [['year', 'ASC'], ['title', 'ASC']],
          where: _defineProperty({}, Op.not, [{ $VideoGame$: null }]),
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: true }
          }
        }).then(function (videogames) {
          return res.status(200).send({ count: videogames.length });
        });
      });
    }
  }, {
    key: 'playedList',
    value: function playedList(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          include: [{
            model: VideoGame,
            attributes: ['id', 'rating', 'HLTB', 'developer'],
            include: [{
              model: Console,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }]
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }, {
            model: User,
            attributes: []
          }],
          order: [[User, UserGM, 'consumedDate', 'ASC'], ['year', 'ASC'], ['title', 'ASC']],
          where: _defineProperty({}, Op.not, [{ $VideoGame$: null }]),
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: true }
          }
        }).then(function (videogames) {
          return res.status(200).send(videogames);
        });
      });
    }
  }, {
    key: 'list',
    value: function list(req, res) {
      return VideoGame.findAll({
        include: [{
          model: GenericMedia,
          attributes: ['image', 'title', 'year', 'consumed', 'commentary', 'consumedDate'],
          include: [{
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }]
        }, {
          model: Console,
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }],
        attributes: ['id', 'HLTB', 'rating', 'developer']
      }).then(function (videoGames) {
        return res.status(200).send({
          success: true,
          message: 'VideoGame list retrieved',
          videoGames: videoGames
        });
      });
    }
  }, {
    key: 'get',
    value: function get(req, res) {
      return VideoGame.findByPk(req.params.videoGameId, {
        include: [{
          model: GenericMedia,
          include: [{ model: Genre }]
        }, {
          model: Console
        }]
      }).then(function (videoGame) {
        if (!videoGame) {
          return res.status(404).send({
            success: false,
            message: 'VideoGame Not Found'
          });
        }
        return res.status(200).send({
          success: true,
          message: 'VideoGame retrieved',
          videoGame: videoGame
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
        return VideoGame.findByPk(req.params.videoGameId).then(function (videoGame) {
          if (!videoGame) {
            return res.status(400).send({
              success: false,
              message: 'Shorts Not Found'
            });
          }
          GenericMedia.findByPk(videoGame.GMId).then(function (gm) {
            return user.removeGenericMedium(gm).then(function () {
              res.status(200).send({
                success: true,
                message: 'Short successfully deleted'
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
    key: 'deleteAdmin',
    value: function deleteAdmin(req, res) {
      return VideoGame.findByPk(req.params.videoGameId).then(function (videoGame) {
        if (!videoGame) {
          return res.status(404).send({
            success: false,
            message: 'VideoGame Not Found'
          });
        }
        GenericMedia.findByPk(videoGame.GMId).then(function (gm) {
          gm.destroy();
        });
        return videoGame.destroy().then(function () {
          res.status(200).send({
            success: false,
            message: 'VideoGame successfully deleted'
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
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
        var _this3 = this;

        var url, spawn, pythonProcess;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                url = req.body.url;

                if (!(typeof url === 'undefined' || !url.includes('https://howlongtobeat.com/game.php?id='))) {
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
                return spawn('python', ['server/controllers/scripts/hltb.py', url]);

              case 6:
                pythonProcess = _context4.sent;

                pythonProcess.stdout.on('data', function (data) {
                  var _JSON$parse = JSON.parse(data.toString()),
                      image = _JSON$parse.image,
                      title = _JSON$parse.title,
                      year = _JSON$parse.year,
                      commentary = _JSON$parse.commentary,
                      HLTB = _JSON$parse.HLTB,
                      developer = _JSON$parse.developer,
                      rating = _JSON$parse.rating,
                      genres = _JSON$parse.genres,
                      consoles = _JSON$parse.consoles;

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
                    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref14) {
                      var _ref16 = _slicedToArray(_ref14, 2),
                          newGM = _ref16[0],
                          createdShort = _ref16[1];

                      var GMId, user;
                      return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              if (!createdShort) {
                                _context3.next = 5;
                                break;
                              }

                              genres.map(function (genre) {
                                Genre.findOrCreate({
                                  where: { name: genre, isFor: 'VideoGame' }
                                }).then(function (_ref17) {
                                  var _ref18 = _slicedToArray(_ref17, 2),
                                      newGenre = _ref18[0],
                                      created = _ref18[1];

                                  newGM.addGenre(newGenre);
                                });
                              });
                              GMId = newGM.id;
                              _context3.next = 5;
                              return VideoGame.create({ HLTB: HLTB, developer: developer, rating: rating, GMId: GMId }).then(function (newVideoGame) {
                                consoles.map(function (aConsole) {
                                  Console.findOrCreate({
                                    where: {
                                      name: aConsole
                                    }
                                  }).then(function (_ref19) {
                                    var _ref20 = _slicedToArray(_ref19, 2),
                                        created = _ref20[0],
                                        found = _ref20[1];

                                    newVideoGame.addConsole(created);
                                  });
                                });
                              });

                            case 5:
                              _context3.next = 7;
                              return req.user;

                            case 7:
                              user = _context3.sent;
                              _context3.next = 10;
                              return user.addGenericMedium(newGM);

                            case 10:
                              res.status(201).send({
                                success: true,
                                message: 'VideoGame successfully created',
                                newGM: newGM
                              });

                            case 11:
                            case 'end':
                              return _context3.stop();
                          }
                        }
                      }, _callee3, _this3);
                    }));

                    return function (_x5) {
                      return _ref15.apply(this, arguments);
                    };
                  }()).catch(function (error) {
                    res.status(400).send({
                      success: false,
                      message: 'VideoGame creation failed',
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
        return _ref13.apply(this, arguments);
      }

      return createByUrl;
    }()
  }, {
    key: 'modify',
    value: function modify(req, res) {
      var _this4 = this;

      var _req$body3 = req.body,
          image = _req$body3.image,
          title = _req$body3.title,
          year = _req$body3.year,
          commentary = _req$body3.commentary,
          HLTB = _req$body3.HLTB,
          developer = _req$body3.developer,
          rating = _req$body3.rating;

      return VideoGame.findByPk(req.params.videoGameId).then(function () {
        var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(videoGame) {
          var gm;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  if (videoGame) {
                    _context5.next = 2;
                    break;
                  }

                  return _context5.abrupt('return', res.status(404).send({
                    success: false,
                    message: 'VideoGame Not Found'
                  }));

                case 2:
                  _context5.next = 4;
                  return videoGame.getGenericMedium();

                case 4:
                  gm = _context5.sent;

                  gm.update({
                    image: image || gm.image,
                    title: title || gm.title,
                    year: year || gm.year,
                    commentary: commentary || gm.commentary
                  });
                  videoGame.update({
                    HLTB: HLTB || videoGame.HLTB,
                    rating: rating || videoGame.rating,
                    developer: developer || videoGame.developer
                  }).then(function (updated) {
                    res.status(200).send({
                      success: false,
                      message: 'VideoGame updated successfully',
                      data: {
                        HLTB: HLTB || videoGame.HLTB,
                        rating: rating || videoGame.rating,
                        developer: developer || videoGame.developer,
                        image: image || gm.image,
                        title: title || gm.title,
                        year: year || gm.year,
                        commentary: commentary || gm.commentary
                      }
                    });
                  }).catch(function (error) {
                    return res.status(400).send({
                      success: false,
                      message: 'VideoGame modification failed',
                      error: error
                    });
                  });

                case 7:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, _this4);
        }));

        return function (_x6) {
          return _ref21.apply(this, arguments);
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
    key: 'played',
    value: function played(req, res) {
      var _this5 = this;

      return req.user.then(function (user) {
        VideoGame.findByPk(req.params.videoGameId).then(function () {
          var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(short) {
            var gm;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return short.getGenericMedium();

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
                        message: 'VideoGame updated successfully!',
                        updated: updated
                      });
                    }).catch(function (error) {
                      res.status(400).send({
                        success: true,
                        message: 'VideoGame updated successfully!',
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
            return _ref22.apply(this, arguments);
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
    key: 'playedDate',
    value: function playedDate(req, res) {
      var _this6 = this;

      var date = req.body.date;

      return req.user.then(function (user) {
        VideoGame.findByPk(req.params.shortId).then(function () {
          var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(videoGame) {
            var gm;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return videoGame.getGenericMedium();

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
                        message: 'VideoGame updated successfully',
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
            return _ref23.apply(this, arguments);
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
    key: 'unPlayed',
    value: function unPlayed(req, res) {
      var _this7 = this;

      return req.user.then(function (user) {
        VideoGame.findByPk(req.params.shortId).then(function () {
          var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(videoGame) {
            var gm;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return videoGame.getGenericMedium();

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
                        message: 'VideoGame updated successfully',
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
            return _ref24.apply(this, arguments);
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

      VideoGame.findByPk(req.params.videoGameId).then(function () {
        var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(videoGame) {
          var GM, newGenres;
          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  if (videoGame) {
                    _context9.next = 2;
                    break;
                  }

                  return _context9.abrupt('return', res.status(404).send({
                    success: false,
                    message: 'VideoGame Not Found'
                  }));

                case 2:
                  _context9.next = 4;
                  return videoGame.getGenericMedium();

                case 4:
                  GM = _context9.sent;
                  newGenres = genres.map(function (genre) {
                    return Genre.findOrCreate({
                      where: {
                        name: genre,
                        isFor: 'VideoGame'
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
                      message: 'Videgames genre change',
                      data: data
                    });
                  }).catch(function (error) {
                    res.status(400).send({
                      success: false,
                      message: 'Videogame modification failed',
                      error: error
                    });
                  });

                case 11:
                case 'end':
                  return _context9.stop();
              }
            }
          }, _callee9, _this8);
        }));

        return function (_x10) {
          return _ref25.apply(this, arguments);
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
    key: 'changeConsoles',
    value: function changeConsoles(req, res) {
      var _this9 = this;

      var consoles = req.body.consoles;

      VideoGame.findByPk(req.params.videoGameId).then(function () {
        var _ref26 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(videoGame) {
          var newConsoles;
          return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  if (videoGame) {
                    _context10.next = 2;
                    break;
                  }

                  return _context10.abrupt('return', res.status(404).send({
                    success: false,
                    message: 'VideoGame Not Found'
                  }));

                case 2:
                  newConsoles = consoles.map(function (console) {
                    return Console.findOrCreate({
                      where: {
                        name: console
                      }
                    });
                  });
                  _context10.next = 5;
                  return Promise.all(newConsoles);

                case 5:
                  newConsoles = _context10.sent;

                  newConsoles = newConsoles.map(function (elem) {
                    return elem[0];
                  });
                  videoGame.setConsoles(newConsoles).then(function (data) {
                    res.status(200).send({
                      success: true,
                      message: 'VideoGame console changed',
                      data: data
                    });
                  }).catch(function (error) {
                    res.status(400).send({
                      success: false,
                      message: 'Videgame modification failed',
                      error: error
                    });
                  });

                case 8:
                case 'end':
                  return _context10.stop();
              }
            }
          }, _callee10, _this9);
        }));

        return function (_x11) {
          return _ref26.apply(this, arguments);
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
            model: VideoGame,
            attributes: []
          }],
          where: _defineProperty({}, Op.not, [{ $VideoGame$: null }]),
          through: {
            where: { consumed: false }
          },
          attributes: [[_sequelize2.default.fn('SUM', _sequelize2.default.col('VideoGame.HLTB')), 'total']],
          raw: true
        }).then(function (videogames) {
          return res.status(200).send({ videogames: videogames });
        });
      });
    }
  }]);

  return VideoGames;
}();

exports.default = VideoGames;