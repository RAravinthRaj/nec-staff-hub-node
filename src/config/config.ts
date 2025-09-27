/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  nodeEnv: string;

  mySqlServiceURI: string;
  mySqlDatabaseName: string;
  mySqlHost: string;
  mySqlPort: number;
  mySqlUser: string;
  mySqlPassword: string;

  valKeyServiceURI: string;
  valKeyHost: string;
  valKeyPort: number;
  valKeyUser: string;
  valKeyPassword: string;

  restPort: number;
  graphqlPort: number;

  smtpUserName: string;
  smtpPassword: string;

  jwtSecretKey: string;
  jwtExpiryTime: any;
  jwtSignInExpiryTime: any;

  imageApiKey: string;
}

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',

  mySqlServiceURI: process.env.MYSQL_SERVICE_URI || '',
  mySqlDatabaseName: process.env.MYSQL_DATABASE_NAME || '',
  mySqlHost: process.env.MYSQL_HOST || '',
  mySqlPort: Number(process.env.MYSQL_PORT),
  mySqlUser: process.env.MYSQL_USER || '',
  mySqlPassword: process.env.MYSQL_PASSWORD || '',

  valKeyServiceURI: process.env.VALKEY_SERVICE_URI || '',
  valKeyHost: process.env.VALKEY_HOST || '',
  valKeyPort: Number(process.env.VALKEY_PORT),
  valKeyUser: process.env.VALKEY_USER || '',
  valKeyPassword: process.env.VAKKEY_PASSWORD || '',

  restPort: Number(process.env.REST_PORT) || 3000,
  graphqlPort: Number(process.env.GRAPHQL_PORT) || 3001,

  smtpUserName: process.env.SMTP_USER_NAME || '',
  smtpPassword: process.env.SMTP_PASSWORD || '',

  jwtSecretKey: process.env.JWT_SECRET || '',
  jwtExpiryTime: process.env.JWT_EXPIRES_IN || ' ',
  jwtSignInExpiryTime: process.env.JWT_SIGN_IN_EXPIRES_IN || ' ',

  imageApiKey: process.env.IMG_BB_API_KEY || '',
};
