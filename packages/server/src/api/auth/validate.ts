import jwt, { JwtHeader, JwtPayload, SigningKeyCallback } from 'jsonwebtoken';
import { JwksClient, SigningKey } from 'jwks-rsa';

export const validateAuthenticationToken = (playerAuthToken: string, authUrl: string): Promise<JwtPayload> => {
  const auth0Url = `https://${authUrl}/`;
  const jwtClient = new JwksClient({
    jwksUri: `https://${authUrl}/.well-known/jwks.json`,
  });

  const getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
    try {
      jwtClient.getSigningKey(header.kid, (err: Error, key: SigningKey) => {
        if (key) {
          const signingKey = key.getPublicKey();
          callback(err, signingKey);
        } else {
          callback(new Error());
        }
      });
    } catch (err) {
      callback(err);
    }
  };

  return new Promise<JwtPayload>((resolve, reject) => {
    if (playerAuthToken) {
      jwt.verify(playerAuthToken, getKey, {}, (err, decoded) => {
        if (err)
          return reject(
            new Error(
              `The token does not match the authentication configuration. Please validate that you are utilizing the correct auth url for Haste.authenticate()`,
            ),
          );
        if (decoded.iss === auth0Url && decoded.exp > new Date().getTime() / 1000) {
          return resolve(decoded);
        } else {
          return reject(new Error('The player access token provided was invalid.'));
        }
      });
    } else {
      reject(new Error('A player token must be provided to the middleware.'));
    }
  });
};
