/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import secured from '../lib/middleware/secured.js';
const router = Router();

/* GET user profile. */
router.get('/user', secured(), function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  res.render('index', {
    userProfile: JSON.stringify(userProfile, null, 2),
    title: 'Profile page',
  });
});

export default router;
