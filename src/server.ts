/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bodyParser from 'body-parser';
import Redis from 'ioredis';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { resolvers, typeDefs } from './graphql/graphql.schema';
import router from './routes/rest.route';
import { config } from './config/config';
import logger from './utils/logger';
import { sequelize } from './config/database';
import { authenticateJWT } from './middlewares/authenticateJwt.middleware';
import { bodySizeLimit, helmetMiddleware, httpsRedirect, rate_limiter } from './middlewares';
import { ValkeyQueueService } from './services/valkeyQueue.service';
import { DeviceToken, Notification } from './models';
import { AttendanceReminderService } from './services/attendanceReminder.service';

const restApp = express();
const graphqlApp = express();
const jsonBodyParser = express.json({ limit: config.requestBodyLimit });
const bodyParserJson = bodyParser.json({ limit: config.requestBodyLimit });
const urlEncodedBodyParser = express.urlencoded({
  extended: true,
  limit: config.requestBodyLimit,
});

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

restApp.use(jsonBodyParser);
restApp.use(bodyParserJson);
restApp.use(urlEncodedBodyParser);

graphqlApp.use(jsonBodyParser);
graphqlApp.use(bodyParserJson);
graphqlApp.use(urlEncodedBodyParser);

restApp.use(rate_limiter);
graphqlApp.use(rate_limiter);

restApp.use(bodySizeLimit);
graphqlApp.use(bodySizeLimit);

restApp.use(httpsRedirect);
graphqlApp.use(httpsRedirect);

restApp.use(helmetMiddleware);
graphqlApp.use(helmetMiddleware);

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

      ssl: config.mySqlCertificate
        ? {
            ca: config.mySqlCertificate?.replace(/\\n/g, '\n'),
            rejectUnauthorized: true,
          }
        : undefined,
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
    await Notification.sync();
    await DeviceToken.sync();
    logger.info('🚀 Sequelize connected successfully');

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
    authenticateJWT,
    expressMiddleware(graphqlServer, {
      context: async ({ req }) => ({ req }),
    }),
  );

  graphqlApp.listen(config.graphqlPort, '0.0.0.0', () => {
    logger.info(`🚀 GRAPHQL Server running at http://localhost:${config.graphqlPort}/graphql`);
  });
}

async function startQueueWorkers() {
  if (!config.valKeyHost || !config.valKeyPort) {
    logger.warn('Valkey configuration missing. Queue workers were not started.');
    return;
  }

  await ValkeyQueueService.getInstance().startWorkers();
  logger.info('🚀 Queue Workers started successfully');
}

(async function bootstrap() {
  await connectMySQL();
  await connectValkey();
  await syncDatabase();

  await startRestServer();
  await startGraphqlServer();
  await startQueueWorkers();
  AttendanceReminderService.getInstance().start();
})();
