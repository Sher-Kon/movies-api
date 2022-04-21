// models/user.js
// это файл моделей пользователя

const { isEmail } = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String, // это строка
    required: true,
    unique: true, // уникальный
    validate: {
      validator: (v) => isEmail(v),
      message: 'Поле "email" должно быть валидным email-адресом',
    },
  },
  password: {
    type: String, // это строка
    required: true,
    select: false,
    minlength: 8,
  },
  name: { // имя пользователя:
    type: String, // это строка
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Пользователь',
  },
});

// для populate() - по ref обязателен user
module.exports = mongoose.model('user', userSchema);
