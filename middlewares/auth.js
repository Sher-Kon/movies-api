const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err'); // 401

const { NODE_ENV, JWT_SECRET = 'some-secret-key' } = process.env; // eslint-disable-line

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация')); // 401 (Нет токена)
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация')); // 401 (токен некорректен)
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
