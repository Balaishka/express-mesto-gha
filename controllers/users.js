const User = require('../models/user');

const errorMessage = (res, status, textMessage) => {
  res.status(status).send({ message: textMessage });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => errorMessage(res, 400, 'Произошла ошибка'));
};

module.exports.getUser = (req, res) => {
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
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar,
  } = req.body;

  User.create({
    name, about, avatar,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        errorMessage(res, 400, 'Неверно введены имя, описание или аватар');
        return;
      }

      errorMessage(res, 500, 'Произошла ошибка');
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
