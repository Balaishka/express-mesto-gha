const validator = require('validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwtSign = require('../helpers/jwt-sign');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
// const CastError = require('../errors/cast-err');
// const ForbidddenError = require('../errors/forbiddden-err');

const errorMessage = (res, status, textMessage) => {
  res.status(status).send({ message: textMessage });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
 /*  User.findById(req.params.userId)
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
    }); */
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  if (!validator.isEmail(email)) {
    throw new ValidationError('Некорректный email пользователя');
  }

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => {
          res.send({
            data: {
              email: user.email,
              name: user.name,
              about: user.about,
              avatar: user.avatar,
            },
          });
        })
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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создаем токен
      const token = jwtSign(user._id);
      return res.send({ token });// возвращаем токен
    })
    .catch(next);
};
