require('dotenv').config();
const session = require('express-session');
const cookieSession = require('cookie-session');
const passport = require('passport');
const redisDb = require('./helpers/connect_redis');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 5000;
const db = require('./config/db');
redisDb.connect();
db.connect();

const IndexRouter = require('./routers/index');

app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
// app.use(
//   cookieSession({
//     name: 'session',
//     keys: ['hientran'],
//     maxAge: 24 * 60 * 60 * 100,
//   })
// );
app.use(passport.initialize());
app.use(passport.session());
app.use('/', IndexRouter);

// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// Error handler function
app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {};
  const status = err.status || 500;
  // response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server on in port : ${PORT}`);
});
