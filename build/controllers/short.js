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

var Short = _models2.default.Short,
    GenericMedia = _models2.default.GenericMedia,
    Genre = _models2.default.Genre,
    User = _models2.default.User,
    UserGM = _models2.default.UserGM;


var Op = _sequelize2.default.Op;

var Shorts = function () {
  function Shorts() {
    _classCallCheck(this, Shorts);
  }

  _createClass(Shorts, null, [{
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
              createdShort = _ref3[1];

          var GMId, user;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (createdShort) {
                    genres.map(function (genre) {
                      Genre.findOrCreate({
                        where: { name: genre, isFor: 'Short' }
                      }).then(function (_ref4) {
                        var _ref5 = _slicedToArray(_ref4, 2),
                            newGenre = _ref5[0],
                            created = _ref5[1];

                        newGM.addGenre(newGenre);
                      });
                    });
                    GMId = newGM.id;

                    Short.create({ duration: duration, rating: rating, GMId: GMId });
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
                    message: 'Short successfully created',
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
          message: 'Short creation failed',
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
        return Short.create({
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
            association: Short.associations.GenericMedium
          }]
        }).then(function () {
          var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(newShort) {
            var GM;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return newShort.getGenericMedium();

                  case 2:
                    GM = _context2.sent;

                    genres.map(function (genre) {
                      Genre.findOrCreate({
                        where: { name: genre, isFor: 'Short' }
                      }).then(function (_ref7) {
                        var _ref8 = _slicedToArray(_ref7, 2),
                            newGenre = _ref8[0],
                            created = _ref8[1];

                        GM.addGenre(newGenre);
                      });
                    });
                    res.status(201).send({
                      success: true,
                      message: 'Short successfully created',
                      newShort: newShort
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
            message: 'Short creation failed',
            error: error
          });
        });
      });
    }
  }, {
    key: 'toWatch',
    value: function toWatch(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          include: [{
            model: Short,
            attributes: ['id', 'rating', 'duration']
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }],
          order: [['year', 'ASC'], ['title', 'ASC']],
          where: _defineProperty({}, Op.not, [{ $Short$: null }]),
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        }).then(function (shorts) {
          return res.status(200).send(shorts);
        });
      });
    }
  }, {
    key: 'toWatchCount',
    value: function toWatchCount(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          include: [{
            model: Short,
            attributes: ['id', 'rating', 'duration']
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }],
          order: [['year', 'ASC'], ['title', 'ASC']],
          where: _defineProperty({}, Op.not, [{ $Short$: null }]),
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        }).then(function (shorts) {
          return res.status(200).send({ count: shorts.length });
        });
      });
    }
  }, {
    key: 'toWatchSum',
    value: function toWatchSum(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          includeIgnoreAttributes: false,
          include: [{
            model: Short,
            attributes: []
          }],
          where: _defineProperty({}, Op.not, [{ $Short$: null }]),
          through: {
            where: { consumed: false }
          },
          attributes: [[_sequelize2.default.fn('SUM', _sequelize2.default.col('Short.duration')), 'total']],
          raw: true
        }).then(function (shorts) {
          return res.status(200).send({ shorts: shorts });
        });
      });
    }
  }, {
    key: 'watchedList',
    value: function watchedList(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          include: [{
            model: Short,
            attributes: ['id', 'rating', 'duration']
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }, {
            model: User,
            attributes: []
          }],
          order: [[User, UserGM, 'consumedDate', 'ASC'], ['year', 'ASC'], ['title', 'ASC']],
          where: _defineProperty({}, Op.not, [{ $Short$: null }]),
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: true }
          }
        }).then(function (shorts) {
          return res.status(200).send(shorts);
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
        return Short.findAll({
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
        }).then(function (shorts) {
          res.status(200).send({
            success: true,
            message: 'Short count successull',
            shorts: shorts
          });
        });
      });
    }
  }, {
    key: 'get',
    value: function get(req, res) {
      return Short.findByPk(req.params.shortId, {
        include: [{
          model: GenericMedia,
          include: [{ model: Genre }]
        }]
      }).then(function (short) {
        if (!short) {
          return res.status(400).send({
            success: true,
            message: 'Short Not Found'
          });
        }
        return res.status(200).send({
          success: true,
          message: 'Short retrieved',
          short: short
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
      return Short.findByPk(req.params.shortId).then(function (short) {
        if (!short) {
          return res.status(400).send({
            success: false,
            message: 'Short Not Found'
          });
        }
        GenericMedia.findByPk(short.GMId).then(function (gm) {
          gm.destroy();
        });
        return short.destroy().then(function () {
          res.status(200).send({
            success: true,
            message: 'Short successfully deleted'
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
    key: 'delete',
    value: function _delete(req, res) {
      return req.user.then(function (user) {
        return Short.findByPk(req.params.shortId).then(function (short) {
          if (!short) {
            return res.status(400).send({
              success: false,
              message: 'Shorts Not Found'
            });
          }
          GenericMedia.findByPk(short.GMId).then(function (gm) {
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
    key: 'createByUrl',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
        var _this3 = this;

        var url, execFile, pythonProcess;
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
                execFile = require('child_process').execFile;
                _context4.next = 6;
                return execFile('python3', ['server/controllers/scripts/imdb.py', url]);

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
                          createdShort = _ref12[1];

                      var GMId, user;
                      return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              if (createdShort) {
                                genres.map(function (genre) {
                                  Genre.findOrCreate({
                                    where: { name: genre, isFor: 'Short' }
                                  }).then(function (_ref13) {
                                    var _ref14 = _slicedToArray(_ref13, 2),
                                        newGenre = _ref14[0],
                                        created = _ref14[1];

                                    newGM.addGenre(newGenre);
                                  });
                                });
                                GMId = newGM.id;

                                Short.create({ duration: duration, rating: rating, GMId: GMId });
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
                                message: 'Short successfully created',
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
                      message: 'Short creation failed',
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
    key: 'createByUrlFlask',
    value: function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
        var _this4 = this;

        var url, result, success, _result, image, title, year, commentary, duration, rating, genres;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                url = req.body.url;

                if (!(typeof url === 'undefined' || !url.includes('imdb.com/title/'))) {
                  _context6.next = 3;
                  break;
                }

                return _context6.abrupt('return', res.status(400).send({
                  success: false,
                  message: 'No url'
                }));

              case 3:
                result = null;
                success = false;
                _context6.next = 7;
                return _axios2.default.post('http://python-dot-jovial-branch-266213.appspot.com/imdb', {
                  url: url
                }).then(function (res) {
                  result = res;
                  success = true;
                }).catch(function (err) {
                  result = err;
                });

              case 7:
                if (success) {
                  _context6.next = 9;
                  break;
                }

                return _context6.abrupt('return', res.status(400).send({
                  success: false,
                  message: result.toString()
                }));

              case 9:
                _result = result, image = _result.image, title = _result.title, year = _result.year, commentary = _result.commentary, duration = _result.duration, rating = _result.rating, genres = _result.genres;
                return _context6.abrupt('return', GenericMedia.findOrCreate({
                  where: {
                    title: title,
                    year: year
                  },
                  defaults: {
                    image: image,
                    commentary: commentary
                  }
                }).then(function () {
                  var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_ref16) {
                    var _ref18 = _slicedToArray(_ref16, 2),
                        newGM = _ref18[0],
                        createdShort = _ref18[1];

                    var GMId, user;
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            if (createdShort) {
                              genres.map(function (genre) {
                                Genre.findOrCreate({
                                  where: { name: genre, isFor: 'Short' }
                                }).then(function (_ref19) {
                                  var _ref20 = _slicedToArray(_ref19, 2),
                                      newGenre = _ref20[0],
                                      created = _ref20[1];

                                  newGM.addGenre(newGenre);
                                });
                              });
                              GMId = newGM.id;

                              Short.create({ duration: duration, rating: rating, GMId: GMId });
                            }

                            _context5.next = 3;
                            return req.user;

                          case 3:
                            user = _context5.sent;
                            _context5.next = 6;
                            return user.addGenericMedium(newGM);

                          case 6:
                            res.status(201).send({
                              success: true,
                              message: 'Short successfully created',
                              newGM: newGM
                            });

                          case 7:
                          case 'end':
                            return _context5.stop();
                        }
                      }
                    }, _callee5, _this4);
                  }));

                  return function (_x8) {
                    return _ref17.apply(this, arguments);
                  };
                }()).catch(function (error) {
                  res.status(400).send({
                    success: false,
                    message: 'Short creation failed',
                    error: error
                  });
                }));

              case 11:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function createByUrlFlask(_x6, _x7) {
        return _ref15.apply(this, arguments);
      }

      return createByUrlFlask;
    }()
  }, {
    key: 'modify',
    value: function modify(req, res) {
      var _this5 = this;

      var _req$body2 = req.body,
          image = _req$body2.image,
          title = _req$body2.title,
          year = _req$body2.year,
          commentary = _req$body2.commentary,
          duration = _req$body2.duration,
          rating = _req$body2.rating;

      return Short.findByPk(req.params.shortId).then(function () {
        var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(short) {
          var gm;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.next = 2;
                  return short.getGenericMedium();

                case 2:
                  gm = _context7.sent;

                  gm.update({
                    image: image || gm.image,
                    title: title || gm.title,
                    year: year || gm.year,
                    commentary: commentary || gm.commentary
                  });
                  short.update({
                    duration: duration || short.duration,
                    rating: rating || short.rating
                  }).then(function (updated) {
                    res.status(200).send({
                      success: true,
                      message: 'Short updated successfully',
                      data: {
                        duration: duration || short.duration,
                        rating: rating || short.rating,
                        image: image || gm.image,
                        title: title || gm.title,
                        year: year || gm.year,
                        commentary: commentary || gm.commentary
                      }
                    });
                  }).catch(function (error) {
                    res.status(400).send({
                      success: false,
                      message: 'Short modification failed',
                      error: error
                    });
                  });

                case 5:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee7, _this5);
        }));

        return function (_x9) {
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
    key: 'watched',
    value: function watched(req, res) {
      var _this6 = this;

      return req.user.then(function (user) {
        Short.findByPk(req.params.shortId).then(function () {
          var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(short) {
            var gm;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return short.getGenericMedium();

                  case 2:
                    gm = _context8.sent;

                    user.addGenericMedium(gm, {
                      through: {
                        consumed: true,
                        consumedDate: Date.now()
                      }
                    }).then(function (updated) {
                      res.status(200).send({
                        success: true,
                        message: 'Short updated successfully!',
                        updated: updated
                      });
                    }).catch(function (error) {
                      res.status(400).send({
                        success: true,
                        message: 'Short updated successfully!',
                        error: error
                      });
                    });

                  case 4:
                  case 'end':
                    return _context8.stop();
                }
              }
            }, _callee8, _this6);
          }));

          return function (_x10) {
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
    key: 'watchedDate',
    value: function watchedDate(req, res) {
      var _this7 = this;

      var date = req.body.date;

      return req.user.then(function (user) {
        Short.findByPk(req.params.shortId).then(function () {
          var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(short) {
            var gm;
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return short.getGenericMedium();

                  case 2:
                    gm = _context9.sent;

                    user.addGenericMedium(gm, {
                      through: {
                        consumed: true,
                        consumedDate: new Date(date)
                      }
                    }).then(function (updated) {
                      res.status(200).send({
                        success: true,
                        message: 'Short updated successfully',
                        updated: updated
                      });
                    });

                  case 4:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, _callee9, _this7);
          }));

          return function (_x11) {
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
    key: 'unwatched',
    value: function unwatched(req, res) {
      var _this8 = this;

      return req.user.then(function (user) {
        Short.findByPk(req.params.shortId).then(function () {
          var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(short) {
            var gm;
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    _context10.next = 2;
                    return short.getGenericMedium();

                  case 2:
                    gm = _context10.sent;

                    user.addGenericMedium(gm, {
                      through: {
                        consumed: false,
                        consumedDate: null
                      }
                    }).then(function (updated) {
                      res.status(200).send({
                        success: true,
                        message: 'Short updated successfully',
                        updated: updated
                      });
                    });

                  case 4:
                  case 'end':
                    return _context10.stop();
                }
              }
            }, _callee10, _this8);
          }));

          return function (_x12) {
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
      var _this9 = this;

      var genres = req.body.genres;

      Short.findByPk(req.params.shortId).then(function () {
        var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(short) {
          var GM, newGenres;
          return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  _context11.next = 2;
                  return short.getGenericMedium();

                case 2:
                  GM = _context11.sent;
                  newGenres = genres.map(function (genre) {
                    return Genre.findOrCreate({
                      where: { name: genre, isFor: 'Short' }
                    });
                  });
                  _context11.next = 6;
                  return Promise.all(newGenres);

                case 6:
                  newGenres = _context11.sent;

                  newGenres = newGenres.map(function (elem) {
                    return elem[0];
                  });
                  GM.setGenres(newGenres).then(function (data) {
                    res.status(200).send({
                      success: true,
                      message: 'Shorts genres changed',
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
                  return _context11.stop();
              }
            }
          }, _callee11, _this9);
        }));

        return function (_x13) {
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
    key: 'sumOfHours',
    value: function sumOfHours(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          includeIgnoreAttributes: false,
          include: [{
            model: Short,
            attributes: []
          }],
          where: _defineProperty({}, Op.not, [{ $Short$: null }]),
          through: {
            where: { consumed: false }
          },
          attributes: [[_sequelize2.default.fn('SUM', _sequelize2.default.col('Short.duration')), 'total']],
          raw: true
        }).then(function (shorts) {
          return res.status(200).send({ shorts: shorts });
        });
      });
    }
  }]);

  return Shorts;
}();

exports.default = Shorts;