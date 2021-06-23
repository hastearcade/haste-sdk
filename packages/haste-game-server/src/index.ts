import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';
import dotenv from 'dotenv';
import { Logger } from 'tslog';
import { koaJwtSecret } from 'jwks-rsa';
import jwt from 'koa-jwt';

dotenv.config();
const log: Logger = new Logger();

const jwtCheck = jwt({
  secret: koaJwtSecret({
    jwksUri: 'https://playhaste.us.auth0.com/.well-known/jwks.json',
    cache: true,
    cacheMaxEntries: 5,
  }),
  audience: 'https://hastegame.api',
  issuer: 'https://playhaste.us.auth0.com/',
  algorithms: ['RS256'],
});

const app = new Koa();
const router = new Router();

// Hello world
router.get('/', async (ctx, next) => {
  ctx.body = { msg: 'Hello world!' };

  await next();
});

router.get('/private', jwtCheck, async (ctx, next) => {
  ctx.body = { msg: 'This is a private endpoint! Keep it secret, keep it safe.' };
  await next();
});

// Middlewares
app.use(json());
app.use(logger());

// Routes
app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT, () => {
  log.info('Koa started');
});
