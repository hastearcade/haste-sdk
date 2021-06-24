import express from 'express';
import dotenv from 'dotenv';
import { Logger } from 'tslog';
import { expressJwtSecret } from 'jwks-rsa';
import jwt from 'express-jwt';

dotenv.config();
const log: Logger = new Logger();
const port = process.env.PORT;

const jwtCheck = jwt({
  secret: expressJwtSecret({
    jwksUri: 'https://playhaste.us.auth0.com/.well-known/jwks.json',
    cache: true,
    cacheMaxEntries: 5,
  }),
  audience: 'https://hastegame.api',
  issuer: 'https://playhaste.us.auth0.com/',
  algorithms: ['RS256'],
});

const app = express();

app.get('/', (req, res) => res.send('Public endpoint'));
app.get('/private', jwtCheck, (req, res) => res.send('Private endpoint'));

app.listen(port, () => {
  log.info(`server started at http://localhost:${port}`);
});
