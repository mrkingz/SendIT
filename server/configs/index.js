import dotenv from "dotenv";

dotenv.config();
const env = process.env.NODE_ENV || "development";
const isProduction = env === "production";

const configs = {
  // Database configuration
  databaseConfig: {
    testConfig: {
      user: process.env.DB_USERNAME_TEST,
      database: process.env.DB_NAME_TEST,
      password: process.env.DB_PASSWORD_TEST,
      port: process.env.DB_PORT_TEST,
      host: process.env.DB_HOST_TEST
    },
    devConfig: {
      user: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST
    },
    prodConfig: process.env.DATABASE_URL
  },
  // Cloudinary configuration
  cloudinaryConfig: {
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    cloud_name: process.env.CLOUD_NAME
  },

  // Nodemailer configuration
  nodemailerConfig: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },

  // Twilio configuration
  twilioConfig: {
    fromNumber: process.env.FROM_NUMBER,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    accountSid: process.env.TWILIO_ACCOUNT_ID
  }
};
export default configs;
