// controllers/users.js
// это файл контроллеров пользователя

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-err'); // 400
const UnauthorizedError = require('../errors/unauthorized-err'); // 401
const NotFoundError = require('../errors/not-found-err'); // 404
const ConflictError = require('../errors/conflict-err'); // 409

const { NODE_ENV, JWT_SECRET = 'some-secret-key' } = process.env; // eslint-disable-line

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта (или пароль)'));// Неправильные почта
      }
      // сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            return Promise.reject(new Error('Неправильные (почта или) пароль'));// хеши не совпали у пароля
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({
        // _id: user.id,
        token,
      });// вернём токен
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message)); // 401
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash, // записываем хеш в базу
    })
      .then((user) => res.send({
        name: user.name,
        _id: user.id,
      })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя')); // 400
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('такой пользователь уже зарегистрирован')); // 409
      } else { next(err); }
    });
};

module.exports.getUserAuth = (req, res, next) => {
  User.findById(req.user._id)// запрос одного
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователь с указанным _id не найден');// 404
      } else {
        res.send({
          name: users.name,
          email: users.email, // очень нужно
          _id: users._id,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id')); // 400
      } else { next(err); }
    });
};

module.exports.updateProfileUser = (req, res, next) => {
  const { name, email } = req.body;
  // обновим имя, найденного по _id пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      _id: user.id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля')); // 400
      } else { next(err); }
    });
};
