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
import Auth0Strategy from 'passport-auth0';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index.js';
import usersRouter from './routes/user.js';
import authRouter from './routes/auth.js';
import userInViews from './lib/middleware/userInViews.js';

config();

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3002/',
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  },
);

passport.use(strategy);

// You can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// config express-session
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

app.use(userInViews());
app.use('/', authRouter);
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
