// controllers/movies.js
// это файл контроллеров фильмов
// getMovies, createMovie, deleteMovie

const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err'); // 404
const ForbiddenError = require('../errors/forbidden-err'); // 403
const BadRequestError = require('../errors/bad-request-err'); // 400

module.exports.getMovies = (req, res, next) => {
  Movie.find({}) // запрос всех
    .then((movies) => res.send({ movies }))//
    .catch(next);
};

// создаёт фильм с переданными в теле
// country, director, duration, year, description, image,
// trailerLink, thumbnail, movieId, nameRU, nameEN
module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send({
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailerLink: movie.trailerLink,
      thumbnail: movie.thumbnail,
      owner: movie.owner,
      movieId: movie.movieId,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма')); // 400
      } else { next(err); }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => { //
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден');// 404
      }
      if (String(movie.owner) === req.user._id) {
        Movie.findByIdAndRemove(req.params.id)
          .then(() => { //
            res.send({ message: 'Фильм удален' });
          });
      } else {
        throw new ForbiddenError('Нельзя удалять чужой фильм'); // 403
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id')); // 400
      } else { next(err); }
    });
};
