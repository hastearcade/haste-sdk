/* eslint-disable import/no-useless-path-segments */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import createError from 'http-errors';
import express, { json, urlencoded, static as stc } from 'express';
import favicon from 'serve-favicon';
import { join } from 'path';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

const app = express();

// view engine setup
app.set('views', join('.', 'views'));
app.set('view engine', 'jade');
app.use(favicon('.' + '/public/images/favicon.ico'));

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(stc(join('.', 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
