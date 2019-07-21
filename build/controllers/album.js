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

var Album = _models2.default.Album,
    GenericMedia = _models2.default.GenericMedia,
    Genre = _models2.default.Genre,
    Song = _models2.default.Song,
    UserGM = _models2.default.UserGM,
    User = _models2.default.User;


var Op = _sequelize2.default.Op;

var Albums = function () {
  function Albums() {
    _classCallCheck(this, Albums);
  }

  _createClass(Albums, null, [{
    key: 'create',
    value: function create(req, res) {
      var _this = this;

      var _req$body = req.body,
          image = _req$body.image,
          title = _req$body.title,
          year = _req$body.year,
          commentary = _req$body.commentary,
          duration = _req$body.duration,
          numberOfSongs = _req$body.numberOfSongs,
          artist = _req$body.artist,
          rating = _req$body.rating,
          genres = _req$body.genres,
          songs = _req$body.songs;

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
                      where: { name: genre, isFor: 'Album' }
                    }).then(function (_ref4) {
                      var _ref5 = _slicedToArray(_ref4, 2),
                          newGenre = _ref5[0],
                          created = _ref5[1];

                      newGM.addGenre(newGenre);
                    });
                  });
                  GMId = newGM.id;
                  _context.next = 5;
                  return Album.create({
                    duration: duration,
                    artist: artist,
                    numberOfSongs: numberOfSongs,
                    rating: rating,
                    GMId: GMId
                  }).then(function (newAlbum) {
                    songs.map(function (song) {
                      Song.create({
                        song: song
                      }).then(function (_ref6) {
                        var _ref7 = _slicedToArray(_ref6, 2),
                            created = _ref7[0],
                            found = _ref7[1];

                        newAlbum.addSong(created);
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
                    message: 'Album successfully created',
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
          message: 'Album creation failed',
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
          duration = _req$body2.duration,
          numberOfSongs = _req$body2.numberOfSongs,
          artist = _req$body2.artist,
          rating = _req$body2.rating,
          genres = _req$body2.genres,
          songs = _req$body2.songs;

      return Album.create({
        duration: duration,
        artist: artist,
        numberOfSongs: numberOfSongs,
        rating: rating,
        GenericMedium: {
          image: image,
          title: title,
          year: year,
          commentary: commentary
        }
      }, {
        include: [{
          association: Album.associations.GenericMedium
        }]
      }).then(function () {
        var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(newAlbum) {
          var GM;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return newAlbum.getGenericMedium();

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
                  songs.map(function (song) {
                    Album.Create({
                      song: song
                    }).then(function (_ref11) {
                      var _ref12 = _slicedToArray(_ref11, 2),
                          created = _ref12[0],
                          found = _ref12[1];

                      newAlbum.addSong(created);
                    });
                  });
                  res.status(201).send({
                    success: true,
                    message: 'Video Game successfully created',
                    newAlbum: newAlbum
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
    key: 'toListen',
    value: function toListen(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          include: [{
            model: Album,
            attributes: ['id', 'rating', 'duration', 'artist', 'numberOfSongs'],
            include: [{
              model: Song,
              attributes: ['disc', 'trackNumber', 'title', 'duration']
            }]
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }],
          order: [['year', 'ASC'], ['title', 'ASC'], [Album, Song, 'disc', 'ASC'], [Album, Song, 'trackNumber', 'ASC']],
          where: _defineProperty({}, Op.not, [{ $Album$: null }]),
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        }).then(function (albums) {
          return res.status(200).send(albums);
        });
      });
    }
  }, {
    key: 'randomAlbum2',
    value: function randomAlbum2(req, res) {
      return req.user.then(function (user) {
        Album.findOne({
          order: [[Song, 'disc', 'ASC'], [Song, 'trackNumber', 'ASC'], [_sequelize2.default.fn('RANDOM')]],
          include: [{
            model: GenericMedia,
            include: [{
              model: User,
              where: { id: user.id },
              attributes: [],
              through: { where: { consumed: false } }
            }, {
              model: Genre,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }]
          }, {
            model: Song,
            attributes: ['title', 'duration', 'trackNumber', 'disc']
          }]
        }).then(function (album) {
          var response = {};
          response['id'] = album['GenericMedium']['id'];
          response['image'] = album['GenericMedium']['image'];
          response['title'] = album['GenericMedium']['title'];
          response['year'] = album['GenericMedium']['year'];
          response['Genres'] = album['GenericMedium']['Genres'];
          response['commentary'] = album['GenericMedium']['commentary'];
          response['Album'] = {};
          response['Album']['id'] = album['id'];
          response['Album']['rating'] = album['rating'];
          response['Album']['duration'] = album['duration'];
          response['Album']['artist'] = album['artist'];
          response['Album']['numberOfSongs'] = album['numberOfSongs'];
          response['Album']['Songs'] = album['Songs'];
          response['Album']['Genres'] = album['Genres'];
          return res.status(200).send(response);
        });
      });
    }
  }, {
    key: 'toListenCount',
    value: function toListenCount(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          include: [{
            model: Album
          }],
          where: _defineProperty({}, Op.not, [{ $Album$: null }]),
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        }).then(function (albums) {
          return res.status(200).send({ count: albums.length });
        });
      });
    }
  }, {
    key: 'listenedCount',
    value: function listenedCount(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          include: [{
            model: Album
          }],
          where: _defineProperty({}, Op.not, [{ $Album$: null }]),
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: true }
          }
        }).then(function (albums) {
          return res.status(200).send({ count: albums.length });
        });
      });
    }
  }, {
    key: 'listenedList',
    value: function listenedList(req, res) {
      return req.user.then(function (user) {
        user.getGenericMedia({
          include: [{
            model: Album,
            attributes: ['id', 'rating', 'duration', 'artist', 'numberOfSongs'],
            include: [{
              model: Song,
              attributes: ['disc', 'trackNumber', 'title', 'duration']
            }]
          }, {
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }, {
            model: User,
            attributes: []
          }],
          order: [[User, UserGM, 'consumedDate', 'ASC'], ['year', 'ASC'], ['title', 'ASC'], [Album, Song, 'disc', 'ASC'], [Album, Song, 'trackNumber', 'ASC']],
          where: _defineProperty({}, Op.not, [{ $Album$: null }]),
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: true }
          }
        }).then(function (albums) {
          return res.status(200).send(albums);
        });
      });
    }
  }, {
    key: 'list',
    value: function list(req, res) {
      return Album.findAll({
        include: [{
          model: GenericMedia,
          attributes: ['image', 'title', 'year', 'commentary'],
          include: [{
            model: Genre,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }]
        }, {
          model: Song,
          attributes: ['disc', 'trackNumber', 'title', 'duration']
        }]
      }).then(function (albums) {
        return res.status(200).send({
          success: true,
          message: 'Album list retrieved',
          albums: albums
        });
      });
    }
  }, {
    key: 'get',
    value: function get(req, res) {
      return Album.findByPk(req.params.albumId, {
        include: [{
          model: GenericMedia,
          include: [{ model: Genre }]
        }, {
          model: Song
        }]
      }).then(function (album) {
        if (!album) {
          return res.status(404).send({
            success: false,
            message: 'Album Not Found'
          });
        }
        return res.status(200).send({
          success: true,
          message: 'Album retrieved',
          album: album
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
        return Album.findByPk(req.params.albumId).then(function (album) {
          if (!album) {
            return res.status(400).send({
              success: false,
              message: 'Album Not Found'
            });
          }
          GenericMedia.findByPk(album.GMId).then(function (gm) {
            return user.removeGenericMedium(gm).then(function () {
              res.status(200).send({
                success: true,
                message: 'Album successfully deleted'
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
      return Album.findByPk(req.params.albumId).then(function (album) {
        if (!album) {
          return res.status(404).send({
            success: false,
            message: 'VideoGame Not Found'
          });
        }
        GenericMedia.findByPk(album.GMId).then(function (gm) {
          gm.destroy();
        });
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
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
        var _this3 = this;

        var url, execFile, pythonProcess;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                url = req.body.url;

                if (!(typeof url === 'undefined' || !url.includes('allmusic.com/') && !url.includes('rateyourmusic.com/'))) {
                  _context6.next = 3;
                  break;
                }

                return _context6.abrupt('return', res.status(400).send({
                  success: false,
                  message: 'No url'
                }));

              case 3:
                execFile = require('child_process').execFile;
                pythonProcess = null;

                if (!url.includes('allmusic.com/')) {
                  _context6.next = 11;
                  break;
                }

                _context6.next = 8;
                return execFile('python', ['server/controllers/scripts/allmusic.py', url]);

              case 8:
                pythonProcess = _context6.sent;
                _context6.next = 14;
                break;

              case 11:
                _context6.next = 13;
                return execFile('python', ['server/controllers/scripts/rym.py', url]);

              case 13:
                pythonProcess = _context6.sent;

              case 14:
                pythonProcess.stdout.on('data', function (data) {
                  var _JSON$parse = JSON.parse(data.toString()),
                      image = _JSON$parse.image,
                      title = _JSON$parse.title,
                      year = _JSON$parse.year,
                      commentary = _JSON$parse.commentary,
                      duration = _JSON$parse.duration,
                      numberOfSongs = _JSON$parse.numberOfSongs,
                      artist = _JSON$parse.artist,
                      rating = _JSON$parse.rating,
                      genres = _JSON$parse.genres,
                      songs = _JSON$parse.songs;

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
                    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_ref14) {
                      var _ref16 = _slicedToArray(_ref14, 2),
                          newGM = _ref16[0],
                          createdShort = _ref16[1];

                      var GMId, user;
                      return regeneratorRuntime.wrap(function _callee5$(_context5) {
                        while (1) {
                          switch (_context5.prev = _context5.next) {
                            case 0:
                              if (!createdShort) {
                                _context5.next = 5;
                                break;
                              }

                              genres.map(function () {
                                var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(genre) {
                                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                    while (1) {
                                      switch (_context3.prev = _context3.next) {
                                        case 0:
                                          _context3.next = 2;
                                          return Genre.findOrCreate({
                                            where: { name: genre, isFor: 'Album' }
                                          }).then(function (_ref18) {
                                            var _ref19 = _slicedToArray(_ref18, 2),
                                                newGenre = _ref19[0],
                                                created = _ref19[1];

                                            return newGM.addGenre(newGenre);
                                          });

                                        case 2:
                                        case 'end':
                                          return _context3.stop();
                                      }
                                    }
                                  }, _callee3, _this3);
                                }));

                                return function (_x6) {
                                  return _ref17.apply(this, arguments);
                                };
                              }());
                              GMId = newGM.id;
                              _context5.next = 5;
                              return Album.create({
                                duration: duration,
                                artist: artist,
                                numberOfSongs: numberOfSongs,
                                rating: rating,
                                GMId: GMId
                              }).then(function () {
                                var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(newAlbum) {
                                  var newSongs;
                                  return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                    while (1) {
                                      switch (_context4.prev = _context4.next) {
                                        case 0:
                                          newSongs = songs.map(function (newSong) {
                                            return Song.create(newSong);
                                          });
                                          _context4.next = 3;
                                          return Promise.all(newSongs);

                                        case 3:
                                          newSongs = _context4.sent;
                                          _context4.next = 6;
                                          return newAlbum.setSongs(newSongs);

                                        case 6:
                                        case 'end':
                                          return _context4.stop();
                                      }
                                    }
                                  }, _callee4, _this3);
                                }));

                                return function (_x7) {
                                  return _ref20.apply(this, arguments);
                                };
                              }());

                            case 5:
                              _context5.next = 7;
                              return req.user;

                            case 7:
                              user = _context5.sent;
                              _context5.next = 10;
                              return user.addGenericMedium(newGM);

                            case 10:
                              return _context5.abrupt('return', res.status(201).send({
                                success: true,
                                message: 'Album successfully created',
                                newGM: newGM
                              }));

                            case 11:
                            case 'end':
                              return _context5.stop();
                          }
                        }
                      }, _callee5, _this3);
                    }));

                    return function (_x5) {
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
                return _context6.stop();
            }
          }
        }, _callee6, this);
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
          duration = _req$body3.duration,
          numberOfSongs = _req$body3.numberOfSongs,
          artist = _req$body3.artist,
          rating = _req$body3.rating;

      return Album.findByPk(req.params.albumId).then(function () {
        var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(album) {
          var gm;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  if (album) {
                    _context7.next = 2;
                    break;
                  }

                  return _context7.abrupt('return', res.status(404).send({
                    success: false,
                    message: 'Album Not Found'
                  }));

                case 2:
                  _context7.next = 4;
                  return album.getGenericMedium();

                case 4:
                  gm = _context7.sent;

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
                  return _context7.stop();
              }
            }
          }, _callee7, _this4);
        }));

        return function (_x8) {
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
    key: 'listened',
    value: function listened(req, res) {
      var _this5 = this;

      return req.user.then(function (user) {
        Album.findByPk(req.params.albumId).then(function () {
          var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(album) {
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
                    return _context8.stop();
                }
              }
            }, _callee8, _this5);
          }));

          return function (_x9) {
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
    key: 'listenedDate',
    value: function listenedDate(req, res) {
      var _this6 = this;

      var date = req.body.date;

      return req.user.then(function (user) {
        Album.findByPk(req.params.albumId).then(function () {
          var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(album) {
            var gm;
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return album.getGenericMedium();

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
                        message: 'Album updated successfully',
                        updated: updated
                      });
                    });

                  case 4:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, _callee9, _this6);
          }));

          return function (_x10) {
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
    key: 'unListened',
    value: function unListened(req, res) {
      var _this7 = this;

      return req.user.then(function (user) {
        Album.findByPk(req.params.albumId).then(function () {
          var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(album) {
            var gm;
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    _context10.next = 2;
                    return album.getGenericMedium();

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
                        message: 'Album updated successfully',
                        updated: updated
                      });
                    });

                  case 4:
                  case 'end':
                    return _context10.stop();
                }
              }
            }, _callee10, _this7);
          }));

          return function (_x11) {
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

      Album.findByPk(req.params.albumId).then(function () {
        var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(album) {
          var GM, newGenres;
          return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  if (album) {
                    _context11.next = 2;
                    break;
                  }

                  return _context11.abrupt('return', res.status(404).send({
                    success: false,
                    message: 'Album Not Found'
                  }));

                case 2:
                  _context11.next = 4;
                  return album.getGenericMedium();

                case 4:
                  GM = _context11.sent;
                  newGenres = genres.map(function (genre) {
                    return Genre.findOrCreate({
                      where: {
                        name: genre,
                        isFor: 'Album'
                      }
                    });
                  });
                  _context11.next = 8;
                  return Promise.all(newGenres);

                case 8:
                  newGenres = _context11.sent;

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
                  return _context11.stop();
              }
            }
          }, _callee11, _this8);
        }));

        return function (_x12) {
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
    key: 'changeSongs',
    value: function changeSongs(req, res) {
      var _this9 = this;

      var songs = req.body.songs;

      Album.findByPk(req.params.albumId).then(function () {
        var _ref26 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(album) {
          var newSongs;
          return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  if (album) {
                    _context12.next = 2;
                    break;
                  }

                  return _context12.abrupt('return', res.status(404).send({
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
                  _context12.next = 5;
                  return Promise.all(newSongs);

                case 5:
                  newSongs = _context12.sent;

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
                  return _context12.stop();
              }
            }
          }, _callee12, _this9);
        }));

        return function (_x13) {
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

  return Albums;
}();

exports.default = Albums;