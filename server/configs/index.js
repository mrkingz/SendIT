import dotenv from 'dotenv';

dotenv.config();

const configs = { 
  // Database configuration
  databaseConfig: { 
    testConfig: {
      user: process.env.DB_USERNAME_TEST,
      database: process.env.DB_NAME_TEST,
      password: process.env.DB_PASSWORD_TEST,
      port: process.env.DB_PORT_TEST,
      host: process.env.DB_HOST_TEST,
    },
    devConfig: {
      user: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
    },
    prodConfig: process.env.DATABASE_URL
  },
  // Cloudinary configuration
  cloudinaryConfig: {
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    cloud_name: process.env.CLOUD_NAME
  },
  // Nexmo configuration
  nexmoConfig: {
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET
  }
 };
 export default configs;
