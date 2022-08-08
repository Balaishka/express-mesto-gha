const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbiddden-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
  // .catch(() => errorMessage(res, 400, 'Произошла ошибка'));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(next);
  /* .catch((err) => {
      if (err.name === 'ValidationError') {
        errorMessage(res, 400, 'Неверно введены название или ссылка');
        return;
      }

      errorMessage(res, 500, 'Произошла ошибка');
    }); */
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }

      if (req.user._id.toString() !== card.owner.toString()) {
        throw new ForbiddenError('Вы не можете удалить эту карточку');
      }

      card.remove();
      res.send({ data: card });
    }).catch(next);
  /* Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch(next); */
  /* .catch((err) => {
      if (err.name === 'CastError') {
        errorMessage(res, 400, 'Некорректный id карточки');
        return;
      }

      errorMessage(res, 500, 'Произошла ошибка');
    }); */
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch(next);
};
