/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export default function () {
  return function (req, res, next) {
    res.locals.user = req.user;
    next();
  };
}
