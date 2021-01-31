'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _movie = require('../controllers/movie');

var _movie2 = _interopRequireDefault(_movie);

var _genre = require('../controllers/genre');

var _genre2 = _interopRequireDefault(_genre);

var _short = require('../controllers/short');

var _short2 = _interopRequireDefault(_short);

var _genericmedia = require('../controllers/genericmedia');

var _genericmedia2 = _interopRequireDefault(_genericmedia);

var _documentary = require('../controllers/documentary');

var _documentary2 = _interopRequireDefault(_documentary);

var _videogame = require('../controllers/videogame');

var _videogame2 = _interopRequireDefault(_videogame);

var _console = require('../controllers/console');

var _console2 = _interopRequireDefault(_console);

var _book = require('../controllers/book');

var _book2 = _interopRequireDefault(_book);

var _user = require('../controllers/user');

var _user2 = _interopRequireDefault(_user);

var _album = require('../controllers/album');

var _album2 = _interopRequireDefault(_album);

var _series = require('../controllers/series');

var _series2 = _interopRequireDefault(_series);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
  app.use((0, _cors2.default)());

  app.get('/api', function (req, res) {
    res.status(200).send({
      success: true,
      message: 'Welcome to the Media List API!'
    });
  });
  //  GenericMedia
  app.get('/api/gm', _genericmedia2.default.list);
  app.get('/api/gm/wut', _genericmedia2.default.deleteNot);
  app.get('/api/gm/count', _genericmedia2.default.count);
  app.get('/api/gm/check', _genericmedia2.default.Cheking);
  app.delete('/api/gm/:gmId', _genericmedia2.default.delete);
  //  Movies
  app.post('/api/movies', _passport2.default.authenticate('jwt', { session: false }), _movie2.default.create);
  app.post('/api/movies/url', _passport2.default.authenticate('jwt', { session: false }), _movie2.default.createByUrlFlask);
  app.get('/api/movies', _passport2.default.authenticate('jwt', { session: false }), _movie2.default.list);
  app.get('/api/movies/towatch', _passport2.default.authenticate('jwt', { session: false }), _movie2.default.getMoviesToWatch);
  app.get('/api/movies/towatch/count', _passport2.default.authenticate('jwt', { session: false }), _movie2.default.getMoviesCount);
  app.get('/api/movies/watched', _passport2.default.authenticate('jwt', { session: false }), _movie2.default.getMoviesWatched);
  app.get('/api/movies/:movieId', _passport2.default.authenticate('jwt', { session: false }), _movie2.default.get);
  app.patch('/api/movies/:movieId', _passport2.default.authenticate('jwt', { session: false }), _movie2.default.modify);
  app.patch('/api/movies/:movieId/genres', _passport2.default.authenticate('jwt', { session: false }), _movie2.default.changeGenres);
  app.patch('/api/movies/:movieId/watched', _passport2.default.authenticate('jwt', { session: false }), _movie2.default.watched);
  app.patch('/api/movies/:movieId/watcheddate', _passport2.default.authenticate('jwt', { session: false }), _movie2.default.watchedDate);
  app.patch('/api/movies/:movieId/unwatched', _passport2.default.authenticate('jwt', { session: false }), _movie2.default.unwatched);
  app.delete('/api/movies/:movieId', _passport2.default.authenticate('jwt', { session: false }), _movie2.default.delete);
  app.get('/api/movies/towatch/sum', _passport2.default.authenticate('jwt', { session: false }), _movie2.default.sumOfHours);
  //  Shorts
  app.post('/api/shorts', _passport2.default.authenticate('jwt', { session: false }), _short2.default.create);
  app.post('/api/shorts/url', _passport2.default.authenticate('jwt', { session: false }), _short2.default.createByUrlFlask);
  app.get('/api/shorts/towatch', _passport2.default.authenticate('jwt', { session: false }), _short2.default.toWatch);
  app.get('/api/shorts/towatch/count', _passport2.default.authenticate('jwt', { session: false }), _short2.default.toWatchCount);
  app.get('/api/shorts/watched', _passport2.default.authenticate('jwt', { session: false }), _short2.default.watchedList);
  app.get('/api/shorts', _passport2.default.authenticate('jwt', { session: false }), _short2.default.list);
  app.get('/api/shorts/:shortId', _passport2.default.authenticate('jwt', { session: false }), _short2.default.get);
  app.patch('/api/shorts/:shortId', _passport2.default.authenticate('jwt', { session: false }), _short2.default.modify);
  app.patch('/api/shorts/:shortId/genres', _passport2.default.authenticate('jwt', { session: false }), _short2.default.changeGenres);
  app.patch('/api/shorts/:shortId/watched', _passport2.default.authenticate('jwt', { session: false }), _short2.default.watched);
  app.patch('/api/shorts/:shortId/watcheddate', _passport2.default.authenticate('jwt', { session: false }), _short2.default.watchedDate);
  app.patch('/api/shorts/:shortId/unwatched', _passport2.default.authenticate('jwt', { session: false }), _short2.default.unwatched);
  app.delete('/api/shorts/:shortId', _passport2.default.authenticate('jwt', { session: false }), _short2.default.delete);
  app.get('/api/shorts/towatch/sum', _passport2.default.authenticate('jwt', { session: false }), _short2.default.sumOfHours);
  //  Documentaries
  app.post('/api/documentaries', _passport2.default.authenticate('jwt', { session: false }), _documentary2.default.create);
  app.post('/api/documentaries/url', _passport2.default.authenticate('jwt', { session: false }), _documentary2.default.createByUrlFlask);
  app.get('/api/documentaries', _passport2.default.authenticate('jwt', { session: false }), _documentary2.default.list);
  app.get('/api/documentaries/towatch', _passport2.default.authenticate('jwt', { session: false }), _documentary2.default.toWatch);
  app.get('/api/documentaries/towatch/count', _passport2.default.authenticate('jwt', { session: false }), _documentary2.default.toWatchCount);
  app.get('/api/documentaries/watched', _passport2.default.authenticate('jwt', { session: false }), _documentary2.default.watchedList);
  app.get('/api/documentaries/:documentaryId', _passport2.default.authenticate('jwt', { session: false }), _documentary2.default.get);
  app.patch('/api/documentaries/:documentaryId', _passport2.default.authenticate('jwt', { session: false }), _documentary2.default.modify);
  app.patch('/api/documentaries/:documentaryId/genres', _passport2.default.authenticate('jwt', { session: false }), _documentary2.default.changeGenres);
  app.patch('/api/documentaries/:documentaryId/watched', _passport2.default.authenticate('jwt', { session: false }), _documentary2.default.watched);
  app.patch('/api/documentaries/:documentaryId/watcheddate', _passport2.default.authenticate('jwt', { session: false }), _documentary2.default.watchedDate);
  app.patch('/api/documentaries/:documentaryId/unwatched', _passport2.default.authenticate('jwt', { session: false }), _documentary2.default.unwatched);
  app.delete('/api/documentaries/:documentaryId', _passport2.default.authenticate('jwt', { session: false }), _documentary2.default.delete);
  app.get('/api/documentaries/towatch/sum', _passport2.default.authenticate('jwt', { session: false }), _documentary2.default.sumOfHours);
  //  Videogames
  app.post('/api/videogames', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.create);
  app.post('/api/videogames/url', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.createByUrlFlask);
  app.get('/api/videogames', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.list);
  app.get('/api/videogames/toplay', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.toPlay);
  app.get('/api/videogames/toplay/count', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.toPlayCount);
  app.get('/api/videogames/played/count', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.playedCount);
  app.get('/api/videogames/toplay/sum', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.sumOfHours);
  app.get('/api/videogames/played', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.playedList);
  app.get('/api/videogames/:videoGameId', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.get);
  app.patch('/api/videogames/:videoGameId', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.modify);
  app.patch('/api/videogames/:videoGameId/genres', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.changeGenres);
  app.patch('/api/videogames/:videoGameId/consoles', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.changeConsoles);
  app.patch('/api/videogames/:videoGameId/played', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.played);
  app.patch('/api/videogames/:videoGameId/playeddate', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.playedDate);
  app.patch('/api/videogames/:videoGameId/unplayed', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.unPlayed);
  app.delete('/api/videogames/:videoGameId', _passport2.default.authenticate('jwt', { session: false }), _videogame2.default.delete);
  //  Genres
  app.post('/api/genres', _genre2.default.Create);
  app.get('/api/genres/movies', _genre2.default.listMovies);
  app.get('/api/genres/shorts', _genre2.default.listShorts);
  app.get('/api/genres/documentaries', _genre2.default.listDocumentaries);
  app.get('/api/genres/videogames', _genre2.default.listVideoGames);
  app.get('/api/genres/books', _genre2.default.listBooks);
  app.get('/api/genres/albums', _genre2.default.listAlbums);
  app.get('/api/genres/series', _genre2.default.listSeries);
  app.get('/api/genres/', _genre2.default.list);
  app.patch('/api/genres/:genreId', _genre2.default.modify);
  app.delete('/api/genres/:genreId', _genre2.default.delete);
  // Consoles
  app.get('/api/consoles/', _console2.default.list);
  //  Books
  app.post('/api/books', _passport2.default.authenticate('jwt', { session: false }), _book2.default.create);
  app.post('/api/books/url', _passport2.default.authenticate('jwt', { session: false }), _book2.default.createByUrlFlask);
  app.get('/api/books', _passport2.default.authenticate('jwt', { session: false }), _book2.default.list);
  app.get('/api/books/toread', _passport2.default.authenticate('jwt', { session: false }), _book2.default.toRead);
  app.get('/api/books/toread/count', _passport2.default.authenticate('jwt', { session: false }), _book2.default.getBooksCount);
  app.get('/api/books/read/count', _passport2.default.authenticate('jwt', { session: false }), _book2.default.readBooksCount);
  app.get('/api/books/toread/sum', _passport2.default.authenticate('jwt', { session: false }), _book2.default.sumOfHours);
  app.get('/api/books/read', _passport2.default.authenticate('jwt', { session: false }), _book2.default.readList);
  app.get('/api/books', _passport2.default.authenticate('jwt', { session: false }), _book2.default.list);
  app.get('/api/books/:bookId', _passport2.default.authenticate('jwt', { session: false }), _book2.default.get);
  app.patch('/api/books/:bookId', _passport2.default.authenticate('jwt', { session: false }), _book2.default.modify);
  app.patch('/api/books/:bookId/genres', _passport2.default.authenticate('jwt', { session: false }), _book2.default.changeGenres);
  app.patch('/api/books/:bookId/read', _passport2.default.authenticate('jwt', { session: false }), _book2.default.read);
  app.patch('/api/books/:bookId/readdate', _passport2.default.authenticate('jwt', { session: false }), _book2.default.readDate);
  app.patch('/api/books/:bookId/unread', _passport2.default.authenticate('jwt', { session: false }), _book2.default.unread);
  app.delete('/api/books/:bookId', _passport2.default.authenticate('jwt', { session: false }), _book2.default.delete);
  //  Albums
  app.post('/api/albums', _passport2.default.authenticate('jwt', { session: false }), _album2.default.create);
  app.post('/api/albums/url', _passport2.default.authenticate('jwt', { session: false }), _album2.default.createByUrlFlask);
  app.get('/api/albums', _album2.default.list);
  app.get('/api/albums/tolisten', _passport2.default.authenticate('jwt', { session: false }), _album2.default.toListen);
  app.get('/api/albums/tolisten/count', _passport2.default.authenticate('jwt', { session: false }), _album2.default.toListenCount);
  app.get('/api/albums/listened/count', _passport2.default.authenticate('jwt', { session: false }), _album2.default.listenedCount);
  app.get('/api/albums/tolisten/sum', _passport2.default.authenticate('jwt', { session: false }), _album2.default.sumOfHours);
  app.get('/api/albums/listened', _passport2.default.authenticate('jwt', { session: false }), _album2.default.listenedList);
  app.get('/api/albums/:albumId', _passport2.default.authenticate('jwt', { session: false }), _album2.default.get);
  app.patch('/api/albums/:albumId', _passport2.default.authenticate('jwt', { session: false }), _album2.default.modify);
  app.patch('/api/albums/:albumId/genres', _passport2.default.authenticate('jwt', { session: false }), _album2.default.changeGenres);
  app.patch('/api/albums/:albumId/songs', _passport2.default.authenticate('jwt', { session: false }), _album2.default.changeSongs);
  app.patch('/api/albums/:albumId/listened', _passport2.default.authenticate('jwt', { session: false }), _album2.default.listened);
  app.patch('/api/albums/:albumId/listeneddate', _passport2.default.authenticate('jwt', { session: false }), _album2.default.listenedDate);
  app.patch('/api/albums/:albumId/unlistened', _passport2.default.authenticate('jwt', { session: false }), _album2.default.unListened);
  app.delete('/api/albums/:albumId', _passport2.default.authenticate('jwt', { session: false }), _album2.default.delete);
  // series
  app.post('/api/series/url', _passport2.default.authenticate('jwt', { session: false }), _series2.default.createByUrlFlask);
  app.get('/api/series/towatch', _passport2.default.authenticate('jwt', { session: false }), _series2.default.toWatch);
  app.get('/api/series/done', _passport2.default.authenticate('jwt', { session: false }), _series2.default.done);
  app.get('/api/series/wfns', _passport2.default.authenticate('jwt', { session: false }), _series2.default.waitingForNewSeason);
  app.get('/api/series/watching', _passport2.default.authenticate('jwt', { session: false }), _series2.default.watching);
  app.get('/api/series/dropped', _passport2.default.authenticate('jwt', { session: false }), _series2.default.dropped);
  app.get('/api/series/towatch/sum', _passport2.default.authenticate('jwt', { session: false }), _series2.default.getSuma);
  app.get('/api/series/towatch/count', _passport2.default.authenticate('jwt', { session: false }), _series2.default.getCount);
  app.get('/api/series/watched/sum', _passport2.default.authenticate('jwt', { session: false }), _series2.default.getEpisodeSum);
  app.get('/api/series/watched/count', _passport2.default.authenticate('jwt', { session: false }), _series2.default.getEpisodeCount);
  app.get('/api/series/:seriesId', _passport2.default.authenticate('jwt', { session: false }), _series2.default.get);
  app.patch('/api/series/:seriesId', _passport2.default.authenticate('jwt', { session: false }), _series2.default.updateByUrlFlask);
  app.patch('/api/series/:seriesId/state', _passport2.default.authenticate('jwt', { session: false }), _series2.default.seriesChangeState);
  app.get('/api/series/:seriesId/status', _passport2.default.authenticate('jwt', { session: false }), _series2.default.getTotalWatched);
  app.patch('/api/episode/:episodeId/watched', _passport2.default.authenticate('jwt', { session: false }), _series2.default.watched);
  app.patch('/api/episode/:episodeId/watchednostats', _passport2.default.authenticate('jwt', { session: false }), _series2.default.watchedNoStats);
  app.patch('/api/episode/:episodeId/unwatched', _passport2.default.authenticate('jwt', { session: false }), _series2.default.unWatched);
  app.get('/api/episode/', _passport2.default.authenticate('jwt', { session: false }), _series2.default.getEpisode);
  app.delete('/api/series/:seriesId', _passport2.default.authenticate('jwt', { session: false }), _series2.default.delete);
  /* app.delete(
    '/api/series/',
    passport.authenticate('jwt', { session: false }),
    Series.nuke
  ) */
  // users
  app.post('/api/register', _user2.default.create);
  app.post('/api/login', _user2.default.login);
  app.get('/api/user/:id', _user2.default.get);
  app.get('/api/user/', _user2.default.list);
  app.get('/api/check', _passport2.default.authenticate('jwt', { session: false }), function (req, res) {
    res.status(200).send({
      message: 'Correctos'
    });
  });
  app.get('/api/renew', _passport2.default.authenticate('jwt', { session: false }), _user2.default.renew);
  app.get('*', function (req, res) {
    res.status(404).send({
      success: false,
      message: 'URL Not Found'
    });
  });
};