const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Неверно введены имя, описание или аватар' });
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Неверно введены имя или описание' });
        return;
      }

      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
