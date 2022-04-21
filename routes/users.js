// routes/users.js
// это файл маршрутов пользователя

const { celebrate, Joi } = require('celebrate');
const routerUsers = require('express').Router(); // создали роутер

const {
  getUserAuth,
  updateProfileUser,
} = require('../controllers/users');

routerUsers.get('/users/me', getUserAuth);

routerUsers.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(2).max(300),
  }),
}), updateProfileUser);

module.exports = routerUsers; // экспортировали роутер
