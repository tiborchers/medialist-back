import Movie from '../controllers/movie'
import Genre from '../controllers/genre'
import Short from '../controllers/short'
import GenericMedia from '../controllers/genericmedia'
import Documentary from '../controllers/documentary'
import VideoGame from '../controllers/videogame'
import Console from '../controllers/console'
import Book from '../controllers/book'
import User from '../controllers/user'
import Album from '../controllers/album'
import Series from '../controllers/series'
import cors from 'cors'
import passport from 'passport'

export default app => {
  app.use(cors())

  app.get('/api', (req, res) => {
    res.status(200).send({
      success: true,
      message: 'Welcome to the Media List API!'
    })
  })
  //  GenericMedia
  app.get('/api/gm', GenericMedia.list)
  app.get('/api/gm/wut', GenericMedia.deleteNot)
  app.get('/api/gm/count', GenericMedia.count)
  app.get('/api/gm/check', GenericMedia.Cheking)
  app.delete('/api/gm/:gmId', GenericMedia.delete)
  //  Movies
  app.post(
    '/api/movies',
    passport.authenticate('jwt', { session: false }),
    Movie.create
  )
  app.post(
    '/api/movies/url',
    passport.authenticate('jwt', { session: false }),
    Movie.createByUrlFlask
  )
  app.get(
    '/api/movies',
    passport.authenticate('jwt', { session: false }),
    Movie.list
  )
  app.get(
    '/api/movies/towatch',
    passport.authenticate('jwt', { session: false }),
    Movie.getMoviesToWatch
  )
  app.get(
    '/api/movies/towatch/count',
    passport.authenticate('jwt', { session: false }),
    Movie.getMoviesCount
  )
  app.get(
    '/api/movies/watched',
    passport.authenticate('jwt', { session: false }),
    Movie.getMoviesWatched
  )
  app.get(
    '/api/movies/:movieId',
    passport.authenticate('jwt', { session: false }),
    Movie.get
  )
  app.patch(
    '/api/movies/:movieId',
    passport.authenticate('jwt', { session: false }),
    Movie.modify
  )
  app.patch(
    '/api/movies/:movieId/genres',
    passport.authenticate('jwt', { session: false }),
    Movie.changeGenres
  )
  app.patch(
    '/api/movies/:movieId/watched',
    passport.authenticate('jwt', { session: false }),
    Movie.watched
  )
  app.patch(
    '/api/movies/:movieId/watcheddate',
    passport.authenticate('jwt', { session: false }),
    Movie.watchedDate
  )
  app.patch(
    '/api/movies/:movieId/unwatched',
    passport.authenticate('jwt', { session: false }),
    Movie.unwatched
  )
  app.delete(
    '/api/movies/:movieId',
    passport.authenticate('jwt', { session: false }),
    Movie.delete
  )
  app.get(
    '/api/movies/towatch/sum',
    passport.authenticate('jwt', { session: false }),
    Movie.sumOfHours
  )
  //  Shorts
  app.post(
    '/api/shorts',
    passport.authenticate('jwt', { session: false }),
    Short.create
  )
  app.post(
    '/api/shorts/url',
    passport.authenticate('jwt', { session: false }),
    Short.createByUrlFlask
  )
  app.get(
    '/api/shorts/towatch',
    passport.authenticate('jwt', { session: false }),
    Short.toWatch
  )
  app.get(
    '/api/shorts/towatch/count',
    passport.authenticate('jwt', { session: false }),
    Short.toWatchCount
  )
  app.get(
    '/api/shorts/watched',
    passport.authenticate('jwt', { session: false }),
    Short.watchedList
  )
  app.get(
    '/api/shorts',
    passport.authenticate('jwt', { session: false }),
    Short.list
  )
  app.get(
    '/api/shorts/:shortId',
    passport.authenticate('jwt', { session: false }),
    Short.get
  )
  app.patch(
    '/api/shorts/:shortId',
    passport.authenticate('jwt', { session: false }),
    Short.modify
  )
  app.patch(
    '/api/shorts/:shortId/genres',
    passport.authenticate('jwt', { session: false }),
    Short.changeGenres
  )
  app.patch(
    '/api/shorts/:shortId/watched',
    passport.authenticate('jwt', { session: false }),
    Short.watched
  )
  app.patch(
    '/api/shorts/:shortId/watcheddate',
    passport.authenticate('jwt', { session: false }),
    Short.watchedDate
  )
  app.patch(
    '/api/shorts/:shortId/unwatched',
    passport.authenticate('jwt', { session: false }),
    Short.unwatched
  )
  app.delete(
    '/api/shorts/:shortId',
    passport.authenticate('jwt', { session: false }),
    Short.delete
  )
  app.get(
    '/api/shorts/towatch/sum',
    passport.authenticate('jwt', { session: false }),
    Short.sumOfHours
  )
  //  Documentaries
  app.post(
    '/api/documentaries',
    passport.authenticate('jwt', { session: false }),
    Documentary.create
  )
  app.post(
    '/api/documentaries/url',
    passport.authenticate('jwt', { session: false }),
    Documentary.createByUrlFlask
  )
  app.get(
    '/api/documentaries',
    passport.authenticate('jwt', { session: false }),
    Documentary.list
  )
  app.get(
    '/api/documentaries/towatch',
    passport.authenticate('jwt', { session: false }),
    Documentary.toWatch
  )
  app.get(
    '/api/documentaries/towatch/count',
    passport.authenticate('jwt', { session: false }),
    Documentary.toWatchCount
  )
  app.get(
    '/api/documentaries/watched',
    passport.authenticate('jwt', { session: false }),
    Documentary.watchedList
  )
  app.get(
    '/api/documentaries/:documentaryId',
    passport.authenticate('jwt', { session: false }),
    Documentary.get
  )
  app.patch(
    '/api/documentaries/:documentaryId',
    passport.authenticate('jwt', { session: false }),
    Documentary.modify
  )
  app.patch(
    '/api/documentaries/:documentaryId/genres',
    passport.authenticate('jwt', { session: false }),
    Documentary.changeGenres
  )
  app.patch(
    '/api/documentaries/:documentaryId/watched',
    passport.authenticate('jwt', { session: false }),
    Documentary.watched
  )
  app.patch(
    '/api/documentaries/:documentaryId/watcheddate',
    passport.authenticate('jwt', { session: false }),
    Documentary.watchedDate
  )
  app.patch(
    '/api/documentaries/:documentaryId/unwatched',
    passport.authenticate('jwt', { session: false }),
    Documentary.unwatched
  )
  app.delete(
    '/api/documentaries/:documentaryId',
    passport.authenticate('jwt', { session: false }),
    Documentary.delete
  )
  app.get(
    '/api/documentaries/towatch/sum',
    passport.authenticate('jwt', { session: false }),
    Documentary.sumOfHours
  )
  //  Videogames
  app.post(
    '/api/videogames',
    passport.authenticate('jwt', { session: false }),
    VideoGame.create
  )
  app.post(
    '/api/videogames/url',
    passport.authenticate('jwt', { session: false }),
    VideoGame.createByUrlFlask
  )
  app.get(
    '/api/videogames',
    passport.authenticate('jwt', { session: false }),
    VideoGame.list
  )
  app.get(
    '/api/videogames/toplay',
    passport.authenticate('jwt', { session: false }),
    VideoGame.toPlay
  )
  app.get(
    '/api/videogames/toplay/count',
    passport.authenticate('jwt', { session: false }),
    VideoGame.toPlayCount
  )
  app.get(
    '/api/videogames/played/count',
    passport.authenticate('jwt', { session: false }),
    VideoGame.playedCount
  )
  app.get(
    '/api/videogames/toplay/sum',
    passport.authenticate('jwt', { session: false }),
    VideoGame.sumOfHours
  )
  app.get(
    '/api/videogames/played',
    passport.authenticate('jwt', { session: false }),
    VideoGame.playedList
  )
  app.get(
    '/api/videogames/:videoGameId',
    passport.authenticate('jwt', { session: false }),
    VideoGame.get
  )
  app.patch(
    '/api/videogames/:videoGameId',
    passport.authenticate('jwt', { session: false }),
    VideoGame.modify
  )
  app.patch(
    '/api/videogames/:videoGameId/genres',
    passport.authenticate('jwt', { session: false }),
    VideoGame.changeGenres
  )
  app.patch(
    '/api/videogames/:videoGameId/consoles',
    passport.authenticate('jwt', { session: false }),
    VideoGame.changeConsoles
  )
  app.patch(
    '/api/videogames/:videoGameId/played',
    passport.authenticate('jwt', { session: false }),
    VideoGame.played
  )
  app.patch(
    '/api/videogames/:videoGameId/playeddate',
    passport.authenticate('jwt', { session: false }),
    VideoGame.playedDate
  )
  app.patch(
    '/api/videogames/:videoGameId/unplayed',
    passport.authenticate('jwt', { session: false }),
    VideoGame.unPlayed
  )
  app.delete(
    '/api/videogames/:videoGameId',
    passport.authenticate('jwt', { session: false }),
    VideoGame.delete
  )
  //  Genres
  app.post('/api/genres', Genre.Create)
  app.get('/api/genres/movies', Genre.listMovies)
  app.get('/api/genres/shorts', Genre.listShorts)
  app.get('/api/genres/documentaries', Genre.listDocumentaries)
  app.get('/api/genres/videogames', Genre.listVideoGames)
  app.get('/api/genres/books', Genre.listBooks)
  app.get('/api/genres/albums', Genre.listAlbums)
  app.get('/api/genres/series', Genre.listSeries)
  app.get('/api/genres/', Genre.list)
  app.patch('/api/genres/:genreId', Genre.modify)
  app.delete('/api/genres/:genreId', Genre.delete)
  // Consoles
  app.get('/api/consoles/', Console.list)
  //  Books
  app.post(
    '/api/books',
    passport.authenticate('jwt', { session: false }),
    Book.create
  )
  app.post(
    '/api/books/url',
    passport.authenticate('jwt', { session: false }),
    Book.createByUrlFlask
  )
  app.get(
    '/api/books',
    passport.authenticate('jwt', { session: false }),
    Book.list
  )
  app.get(
    '/api/books/toread',
    passport.authenticate('jwt', { session: false }),
    Book.toRead
  )
  app.get(
    '/api/books/toread/count',
    passport.authenticate('jwt', { session: false }),
    Book.getBooksCount
  )
  app.get(
    '/api/books/read/count',
    passport.authenticate('jwt', { session: false }),
    Book.readBooksCount
  )
  app.get(
    '/api/books/toread/sum',
    passport.authenticate('jwt', { session: false }),
    Book.sumOfHours
  )
  app.get(
    '/api/books/read',
    passport.authenticate('jwt', { session: false }),
    Book.readList
  )
  app.get(
    '/api/books',
    passport.authenticate('jwt', { session: false }),
    Book.list
  )
  app.get(
    '/api/books/:bookId',
    passport.authenticate('jwt', { session: false }),
    Book.get
  )
  app.patch(
    '/api/books/:bookId',
    passport.authenticate('jwt', { session: false }),
    Book.modify
  )
  app.patch(
    '/api/books/:bookId/genres',
    passport.authenticate('jwt', { session: false }),
    Book.changeGenres
  )
  app.patch(
    '/api/books/:bookId/read',
    passport.authenticate('jwt', { session: false }),
    Book.read
  )
  app.patch(
    '/api/books/:bookId/readdate',
    passport.authenticate('jwt', { session: false }),
    Book.readDate
  )
  app.patch(
    '/api/books/:bookId/unread',
    passport.authenticate('jwt', { session: false }),
    Book.unread
  )
  app.delete(
    '/api/books/:bookId',
    passport.authenticate('jwt', { session: false }),
    Book.delete
  )
  //  Albums
  app.post(
    '/api/albums',
    passport.authenticate('jwt', { session: false }),
    Album.create
  )
  app.post(
    '/api/albums/url',
    passport.authenticate('jwt', { session: false }),
    Album.createByUrlFlask
  )
  app.get('/api/albums', Album.list)
  app.get(
    '/api/albums/tolisten',
    passport.authenticate('jwt', { session: false }),
    Album.toListen
  )
  app.get(
    '/api/albums/tolisten/count',
    passport.authenticate('jwt', { session: false }),
    Album.toListenCount
  )
  app.get(
    '/api/albums/listened/count',
    passport.authenticate('jwt', { session: false }),
    Album.listenedCount
  )
  app.get(
    '/api/albums/tolisten/sum',
    passport.authenticate('jwt', { session: false }),
    Album.sumOfHours
  )
  app.get(
    '/api/albums/listened',
    passport.authenticate('jwt', { session: false }),
    Album.listenedList
  )
  app.get(
    '/api/albums/:albumId',
    passport.authenticate('jwt', { session: false }),
    Album.get
  )
  app.patch(
    '/api/albums/:albumId',
    passport.authenticate('jwt', { session: false }),
    Album.modify
  )
  app.patch(
    '/api/albums/:albumId/genres',
    passport.authenticate('jwt', { session: false }),
    Album.changeGenres
  )
  app.patch(
    '/api/albums/:albumId/songs',
    passport.authenticate('jwt', { session: false }),
    Album.changeSongs
  )
  app.patch(
    '/api/albums/:albumId/listened',
    passport.authenticate('jwt', { session: false }),
    Album.listened
  )
  app.patch(
    '/api/albums/:albumId/listeneddate',
    passport.authenticate('jwt', { session: false }),
    Album.listenedDate
  )
  app.patch(
    '/api/albums/:albumId/unlistened',
    passport.authenticate('jwt', { session: false }),
    Album.unListened
  )
  app.delete(
    '/api/albums/:albumId',
    passport.authenticate('jwt', { session: false }),
    Album.delete
  )
  // series
  app.post(
    '/api/series/url',
    passport.authenticate('jwt', { session: false }),
    Series.createByUrlFlask
  )
  app.get(
    '/api/series/towatch',
    passport.authenticate('jwt', { session: false }),
    Series.toWatch
  )
  app.get(
    '/api/series/done',
    passport.authenticate('jwt', { session: false }),
    Series.done
  )
  app.get(
    '/api/series/wfns',
    passport.authenticate('jwt', { session: false }),
    Series.waitingForNewSeason
  )
  app.get(
    '/api/series/watching',
    passport.authenticate('jwt', { session: false }),
    Series.watching
  )
  app.get(
    '/api/series/dropped',
    passport.authenticate('jwt', { session: false }),
    Series.dropped
  )
  app.get(
    '/api/series/towatch/sum',
    passport.authenticate('jwt', { session: false }),
    Series.getSuma
  )
  app.get(
    '/api/series/towatch/count',
    passport.authenticate('jwt', { session: false }),
    Series.getCount
  )
  app.get(
    '/api/series/watched/sum',
    passport.authenticate('jwt', { session: false }),
    Series.getEpisodeSum
  )
  app.get(
    '/api/series/watched/count',
    passport.authenticate('jwt', { session: false }),
    Series.getEpisodeCount
  )
  app.get(
    '/api/series/:seriesId',
    passport.authenticate('jwt', { session: false }),
    Series.get
  )
  app.patch(
    '/api/series/:seriesId',
    passport.authenticate('jwt', { session: false }),
    Series.updateByUrlFlask
  )
  app.patch(
    '/api/series/:seriesId/state',
    passport.authenticate('jwt', { session: false }),
    Series.seriesChangeState
  )
  app.get(
    '/api/series/:seriesId/status',
    passport.authenticate('jwt', { session: false }),
    Series.getTotalWatched
  )
  app.patch(
    '/api/episode/:episodeId/watched',
    passport.authenticate('jwt', { session: false }),
    Series.watched
  )
  app.patch(
    '/api/episode/:episodeId/watchednostats',
    passport.authenticate('jwt', { session: false }),
    Series.watchedNoStats
  )
  app.patch(
    '/api/episode/:episodeId/unwatched',
    passport.authenticate('jwt', { session: false }),
    Series.unWatched
  )
  app.get(
    '/api/episode/',
    passport.authenticate('jwt', { session: false }),
    Series.getEpisode
  )
  app.delete(
    '/api/series/:seriesId',
    passport.authenticate('jwt', { session: false }),
    Series.delete
  )
  /* app.delete(
    '/api/series/',
    passport.authenticate('jwt', { session: false }),
    Series.nuke
  ) */
  // users
  app.post('/api/register', User.create)
  app.post('/api/login', User.login)
  app.get('/api/user/:id', User.get)
  app.get('/api/user/', User.list)
  app.get(
    '/api/check',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      res.status(200).send({
        message: 'Correctos'
      })
    }
  )
  app.get(
    '/api/renew',
    passport.authenticate('jwt', { session: false }),
    User.renew
  )
  app.get('*', (req, res) => {
    res.status(404).send({
      success: false,
      message: 'URL Not Found'
    })
  })
}
