const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    required: true,
  },
  likes: {
    required: true,
  },
  createdAt: {
    required: true,
  },
});

module.exports = mongoose.model('card', cardSchema);
