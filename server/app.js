import express from 'express';
import logger from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import routes from './routes';
import db from './database/index';

dotenv.config();
const app = express();
let env = process.env.NODE_ENV;
env = typeof env !== 'undefined' ? env.trim() : env;

app.use(logger('dev'));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(cookieParser());
app.disable('x-powered-by');
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  next();
});

app.use(express.static('public'));
app.use(routes.authRoutes);
app.use(routes.parcelRoutes);
app.use(routes.pageRoutes);

app.all('/api', (req, res) => {
  res.status('200').send({
    status: 'Success',
    message: 'Connection ok'
  });
});

app.all('*', (req, res) => {
  res.status('404').json({
    status: 'Fail',
    message: 'Sorry, there is nothing here!'
  });
});

try {
  const port = process.env.PORT || 8000;
    if (env !== 'test' && env !== 'development') {
      db.createTables().then(() => {}).catch(() => {});
    }
    app.listen(port, () => {
      if (env === 'test' || env === 'development') {
        console.log(`Server running on port: ${port}`);
      }
    });
} catch (err) {
  if (env === 'test' && env === 'development') {
    console.log(err);
  }
}

export default app;