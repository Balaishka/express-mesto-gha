// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

// app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

/* app.get('/posts', (req, res) => {
  console.log(req.cookies.jwt); // достаём токен
}); */

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
  /* console.log('Ссылка на сервер');
  console.log(BASE_PATH); */
});
