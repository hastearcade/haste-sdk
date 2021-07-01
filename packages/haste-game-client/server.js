/* eslint-disable */
const express = require('express');
const path = require('path');
const app = express();
var secure = require('express-force-https');

app.use(secure);
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/assets/images/:imageName', function (req, res) {
  res.sendFile(join(__dirname, `dist/assets/images/${req.params['imageName']}`));
});
app.get('/assets/pack.json', function (req, res) {
  res.sendFile(join(__dirname, `dist/assets/pack.json`));
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(process.env.PORT || 8080);
