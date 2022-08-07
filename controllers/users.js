const validator = require('validator');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { jwtSign } = require('../helpers/jwt-sign');
const { jwtVerify } = require('../helpers/jwt-verify');

const errorMessage = (res, status, textMessage) => {
  res.status(status).send({ message: textMessage });
};

module.exports.getUsers = (req, res) => {
  const isVerified = jwtVerify(req.headers.authorization);

  if (isVerified) {
    return User.find({})
      .then((users) => res.send({ data: users }))
      .catch(() => errorMessage(res, 400, 'Произошла ошибка'));
  }

  return errorMessage(res, 403, 'Вы не авторизованы');
};

/* module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        errorMessage(res, 404, 'Пользователь не найден');
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        errorMessage(res, 400, 'Некорректный id пользователя');
        return;
      }

      errorMessage(res, 500, 'Произошла ошибка');
    });
}; */

module.exports.getUserInfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        errorMessage(res, 404, 'Пользователь не найден');
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        errorMessage(res, 400, 'Некорректный id пользователя');
        return;
      }

      errorMessage(res, 500, 'Произошла ошибка');
    });
};

module.exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  if (!validator.isEmail(email)) {
    errorMessage(res, 400, 'Некорректный email пользователя');
    return;
  }

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err.name === 'MongoServerError') {
            errorMessage(res, 409, 'Пользователь с таким email уже существует');
            return;
          }

          if (err.name === 'ValidationError') {
            errorMessage(res, 400, 'Неверно введены имя, описание или аватар');
            return;
          }

          errorMessage(res, 500, 'Произошла ошибка');
        });
    });
};

module.exports.updateUserInfo = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        errorMessage(res, 404, 'Пользователь не найден');
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        errorMessage(res, 400, 'Неверно введены имя или описание');
        return;
      }

      if (err.name === 'CastError') {
        errorMessage(res, 400, 'Некорректный id пользователя');
        return;
      }

      errorMessage(res, 500, 'Произошла ошибка');
    });
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        errorMessage(res, 404, 'Пользователь не найден');
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        errorMessage(res, 400, 'Некорректный id пользователя');
        return;
      }

      errorMessage(res, 500, 'Произошла ошибка');
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создаем токен
      const token = jwtSign(user._id);
      return res.send({ token });// возвращаем токен
    })
    .catch((err) => {
      if (err.name === 'Error') {
        errorMessage(res, 401, 'Неправильные почта или пароль');
      }

      errorMessage(res, 500, 'Произошла ошибка');
    });
};
