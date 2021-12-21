import { Router } from 'express';
const router = Router();

/* GET home page. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Haste Regular Web Application Example' });
});

export default router;
