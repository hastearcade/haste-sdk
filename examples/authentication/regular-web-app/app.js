/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import createError from 'http-errors';
import express, { json, urlencoded, static as stc } from 'express';
import favicon from 'serve-favicon';
import { join } from 'path';
import session from 'express-session';
import passport from 'passport';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index.js';
import usersRouter from './routes/user.js';

import { hasteAuthRoutes, hasteUserInViews, HasteStrategy } from '@hastearcade/haste-express';

config();

passport.use(HasteStrategy.initialize());

// You can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

const sess = {
  secret: 'shhhh', // this would change in a real application
  resave: false,
  saveUninitialized: true,
  cookie: {},
};

const app = express();

app.use(cookieParser());
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', join('.', 'views'));
app.set('view engine', 'jade');
app.use(favicon('.' + '/public/images/favicon.ico'));

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(stc(join('.', 'public')));

app.use(hasteUserInViews());
app.use('/', hasteAuthRoutes);
app.use('/', indexRouter);
app.use('/', usersRouter);

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
