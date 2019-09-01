import * as express from 'express';
import * as path from 'path';

const PORT = 3000;
const app = express();

app
  .use('/', express.static(path.resolve(__dirname, '..')))
  .listen(PORT, () => {
    // tslint:disable-next-line no-console
    console.log(`Server listening on port ${PORT}`);
  });
