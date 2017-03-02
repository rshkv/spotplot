const express = require('express');
const path = require('path');
const router = require('./routes');

const app = express();

app
  .use(express.static(path.resolve(__dirname, '../client/public')))
  .use('/', router)
  .listen('3000', () => {
    console.log('Server listening on port 3000');
  });
