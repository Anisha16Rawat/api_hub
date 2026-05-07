require('dotenv').config();

const config = {
  DB_HOST: process.env.DB_HOST ,
  DB_PORT: Number(process.env.DB_PORT) ,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD ,
  DB_NAME: process.env.DB_NAME,

  // JWT DATA
  JWT_EXPIRY: process.env.JWT_EXPIRY,
  JWT_ALGO: process.env.JWT_ALGO ,
  JWT_SECRET: process.env.JWT_SECRET,
  PWD_SALT: Number(process.env.PWD_SALT) ,
};

module.exports = config;
