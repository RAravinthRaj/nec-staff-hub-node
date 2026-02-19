/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import 'module-alias/register';
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import Redis from 'ioredis';
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { resolvers, typeDefs } from '@/src/graphql/graphql.schema';
import router from '@/src/routes/rest.route';
import { config } from '@/src/config/config';
import logger from '@/src/utils/logger';
import { sequelize } from '@/src/config/database';
import '@/src/models';

const restApp = express();
const graphqlApp = express();

restApp.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

graphqlApp.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

restApp.use(express.json());
restApp.use(bodyParser.json());

graphqlApp.use(express.json());
graphqlApp.use(bodyParser.json());

let dbConnection: mysql.Connection;
let valkeyClient: Redis;

async function connectMySQL() {
  try {
    dbConnection = await mysql.createConnection({
      host: config.mySqlHost,
      port: config.mySqlPort,
      user: config.mySqlUser,
      password: config.mySqlPassword,
      database: config.mySqlDatabaseName,
      ssl: { ca: fs.readFileSync(path.resolve(__dirname, '../ca.pem')) },
    });

    logger.info('🚀 MySQL Database connected successfully');
    return dbConnection;
  } catch (err: any) {
    logger.error(`MySQL connection error: ${err}`);
    process.exit(1);
  }
}

async function connectValkey() {
  valkeyClient = new Redis({
    host: config.valKeyHost,
    port: Number(config.valKeyPort),
    username: config.valKeyUser,
    password: config.valKeyPassword,
    tls: {},
  });

  valkeyClient.on('error', (err) => logger.error('Valkey error:', err));

  logger.info('🚀 VALKEY Server Connected successfully');
  return valkeyClient;
}

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('🚀 Sequelize connected successfully');

    await sequelize.sync({ alter: true });
    logger.info('🚀 Tables synced successfully');
  } catch (error) {
    logger.error('❌ Sequelize sync error:', error);
    process.exit(1);
  }
}

async function startRestServer() {
  restApp.use('/rest', router);

  restApp.listen(config.restPort, '0.0.0.0', () => {
    logger.info(`🚀 REST Server running at http://localhost:${config.restPort}/rest`);
  });
}

async function startGraphqlServer() {
  const graphqlServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    introspection: config.nodeEnv === 'development',
    plugins: [
      config.nodeEnv === 'development'
        ? ApolloServerPluginLandingPageLocalDefault({ embed: true })
        : ApolloServerPluginLandingPageDisabled(),
    ],
    formatError: (formattedError) => ({
      message: formattedError.message,
      path: formattedError.path,
      locations: formattedError.locations,
      extensions: { code: formattedError.extensions?.code },
    }),
  });

  await graphqlServer.start();

  graphqlApp.use(
    '/graphql',
    expressMiddleware(graphqlServer, {
      context: async ({ req }) => ({
        req,
        db: dbConnection,
        valkey: valkeyClient,
      }),
    }),
  );

  graphqlApp.listen(config.graphqlPort, '0.0.0.0', () => {
    logger.info(`🚀 GRAPHQL Server running at http://localhost:${config.graphqlPort}/graphql`);
  });
}

async function startQueueWorkers() {
  logger.info('🚀 Queue Workers started successfully');
}

(async function bootstrap() {
  await connectMySQL();
  // await connectValkey();
  await syncDatabase();

  await startRestServer();
  // await startGraphqlServer();
  await startQueueWorkers();
})();
