/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Router } from 'express';
import passport from 'passport';
import { config } from 'dotenv';
import { format } from 'util';
import { URL } from 'url';
import { stringify } from 'querystring';
import { HasteStrategy } from './hasteStrategy.js';

const router = Router();
config();

passport.use(HasteStrategy.initialize());

router.get(
  '/login',
  passport.authenticate('auth0', {
    audience: 'https://haste.api',
    connection: 'Haste-Authorization',
    scope: 'openid email profile offline_access',
  }),
  function (req, res) {
    res.redirect('/');
  },
);

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || '/user');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();

  let returnTo = req.protocol + '://' + req.hostname;
  const port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }

  const logoutURL = new URL(format('https://%s/v2/logout', process.env.AUTH0_DOMAIN));
  const searchString = stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo,
  });

  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

export { router as hasteAuthRoutes };
