/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export default function () {
  return function secured(req, res, next) {
    if (req.user) {
      return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  };
}
