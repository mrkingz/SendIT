import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookiePasrer from 'cookie-parser';
import routes from './routes';

dotenv.config();
const app = express();

app.use(logger('dev'));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(cookiePasrer());
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
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
} catch (err) {
    //
}

export default app;