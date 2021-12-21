/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

function hasteUserInViews() {
  return function (req, res, next) {
    if (req.user && req.user._json) {
      res.locals.user = {
        displayName: req.user._json['https://hastearcade.com/displayName'],
        picture: req.user.picture,
      };
    }
    next();
  };
}

export { hasteUserInViews };
