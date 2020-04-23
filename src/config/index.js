'use strict';

require('dotenv').config();

const config = {
  NODE_ENV: process.env.NODE_ENV,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  APP_PORT: process.env.APP_PORT,
  DB_DIALECT: process.env.DB_DIALECT,
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  BASE_URL: process.env.BASE_URL,
  SWAGGER_BASE_URL: process.env.SWAGGER_BASE_URL,
  // S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  // S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  // S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  // SEND_FROM_EMAIL: process.env.SEND_FROM_EMAIL,
  // SEND_FROM_NAME: process.env.SEND_FROM_NAME,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  ELASTICSEARCH_HOST: process.env.ELASTICSEARCH_HOST,
  ELASTICSEARCH_PORT: process.env.ELASTICSEARCH_PORT
};
module.exports = config;
