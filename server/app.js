import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
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
app.use(routes.authRoutes);
app.use(routes.parcelRoutes);

app.all('/api', (req, res) => {
  res.status('200').send({
    status: 'Success',
    message: 'Connection ok'
  });
});

app.all('*', (req, res) => {
  res.status('400').json({
    status: 'Fail',
    message: 'Sorry, there is nothing here!'
  });
});

try {
  const port = process.env.PORT || 8000;
    db.createTables().then(() => {}).catch(() => {});
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