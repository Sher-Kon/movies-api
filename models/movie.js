// models/movie.js
// это файл моделей фильмов

const { isURL } = require('validator');
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: { // страна создания фильма:
    type: String, // это строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Тридевятое царство',
  },

  director: { // режиссёр фильма:
    type: String, // это строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Царь Додон',
  },

  duration: { // длительность фильма:
    type: Number, // это число
    required: true, // обязательное поле
    default: '2',
  },

  year: { // год выпуска фильма:
    type: String, // это строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 4, // а максимальная — 4 символa
    default: '1991',
  },

  description: { // описание фильма:
    type: String, // это строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 300, // а максимальная — 30 символов
    default: 'Сказка, мелодрама, ч/б',
  },

  image: { //  ссылка на постер к фильму:
    type: String, // это строка
    required: true, // обязательное поле
    validate: {
      validator: (v) => isURL(v),
      message: 'Поле "image" должно быть валидным URL-адресом',
    },
  },

  trailerLink: { //  ссылка на трейлер фильма:
    type: String, // это строка
    required: true, // обязательное поле
    validate: {
      validator: (v) => isURL(v),
      message: 'Поле "trailerLink" должно быть валидным URL-адресом',
    },
  },

  thumbnail: { //  миниатюрное изображение постера к фильму:
    type: String, // это строка
    required: true, // обязательное поле
    validate: {
      validator: (v) => isURL(v),
      message: 'Поле "thumbnail" должно быть валидным URL-адресом',
    },
  },

  owner: { //  _id пользователя, который сохранил фильм:
    type: mongoose.Types.ObjectId, // String, // это ObjectId
    ref: 'user',
    required: true, // обязательное поле
  },

  movieId: { //  id фильма, который содержится в ответе сервиса MoviesExplorer:
    type: mongoose.Types.ObjectId, // String, // это ObjectId
    ref: 'user',
    required: true, // обязательное поле
  },

  nameRU: { // название фильма на русском языке:
    type: String, // это строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },

  nameEN: { // название фильма на английском языке:
    type: String, // это строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },

});

// создаём модель и экспортируем её
module.exports = mongoose.model('movie', movieSchema);
