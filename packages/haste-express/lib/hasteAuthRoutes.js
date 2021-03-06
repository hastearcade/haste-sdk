/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import passport from 'passport';
import { config } from 'dotenv';
import { format } from 'util';
import { URL } from 'url';
import { stringify } from 'querystring';
import { HasteStrategy } from './hasteStrategy.js';
import { v4 } from 'uuid';

const router = Router();
config();

passport.use(HasteStrategy.initialize());

router.get(
  '/login',
  function (req, res, next) {
    const port = process.env.NODE_ENV !== 'production' ? req.app.settings.port : 443;
    passport.authenticate(
      'auth0',
      {
        audience: 'https://haste.api',
        connection: 'Haste-Authorization',
        scope: 'openid email profile offline_access',
        login_hint: Buffer.from(
          `${v4()};;;;;${req.protocol}://${req.hostname}${port === 80 || port === 443 ? '' : `:${port}`}/silentlogin`,
        ).toString('base64'),
      },
      function (err, user, info) {
        if (err) {
          return next(err);
        }
      },
    )(req, res, next);
  },
  function (req, res) {
    res.redirect('/');
  },
);

router.get(
  '/silentlogin',
  passport.authenticate('auth0', {
    audience: 'https://haste.api',
    connection: 'Haste-Authorization',
    scope: 'openid email profile offline_access',
    prompt: 'none',
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
      res.redirect(returnTo || process.env.AUTH0_LOGGED_IN_URL);
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();

  const prot = process.env.NODE_ENV !== 'production' ? req.protocol : 'https';
  let returnTo = prot + '://' + req.hostname;
  const port = process.env.NODE_ENV !== 'production' ? req.app.settings.port : 443;

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
