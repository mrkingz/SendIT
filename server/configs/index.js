import dotenv from 'dotenv';

dotenv.config();

const testConfig = {
  user: process.env.DB_USERNAME_TEST,
  database: process.env.DB_NAME_TEST,
  password: process.env.DB_PASSWORD_TEST,
  port: process.env.DB_PORT_TEST,
  host: process.env.DB_HOST_TEST,
};

const devConfig = {
  user: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
};

const prodConfig = process.env.DB_URL;

export {
  devConfig,
  prodConfig,
  testConfig
};
