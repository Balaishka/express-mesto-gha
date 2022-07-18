const Card = require('../models/card');

const errorMessage = (res, status, textMessage) => {
  res.status(status).send({ message: textMessage });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => errorMessage(res, 400, 'Произошла ошибка'));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        errorMessage(res, 400, 'Неверно введены название или ссылка');
        return;
      }

      errorMessage(res, 500, 'Произошла ошибка');
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        errorMessage(res, 404, 'Карточка не найдена');
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        errorMessage(res, 400, 'Некорректный id карточки');
        return;
      }

      errorMessage(res, 500, 'Произошла ошибка');
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        errorMessage(res, 404, 'Карточка не найдена');
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        errorMessage(res, 400, 'Некорректный id карточки');
        return;
      }

      errorMessage(res, 500, 'Произошла ошибка');
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        errorMessage(res, 404, 'Карточка не найдена');
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        errorMessage(res, 400, 'Некорректный id карточки');
        return;
      }

      errorMessage(res, 500, 'Произошла ошибка');
    });
};
