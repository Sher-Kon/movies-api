// routes/cards.js
// это файл маршрутов фильмов

const { celebrate, Joi } = require('celebrate');
const routerMovies = require('express').Router(); // создали роутер
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

routerMovies.get('/movies', getMovies);

routerMovies.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.string().required().min(2).max(30),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required().min(2).max(300),
    image: Joi.string().required().min(2).max(300),
    trailerLink: Joi.string().required().min(2).max(300),
    thumbnail: Joi.string().required().min(2).max(300),
    movieId: Joi.string().required().min(2).max(30),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
  }),
}), createMovie);

routerMovies.delete('/movies/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = routerMovies; // экспортировали роутер
