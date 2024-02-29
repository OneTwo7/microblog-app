import { ApolloServer } from '@apollo/server';
import { config as dotEnvConfig } from 'dotenv-safe';
import express from 'express';
import { DataSource } from 'typeorm';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import redis from 'ioredis';
import session from 'express-session';
import RedisStore from 'connect-redis';
import uuid from 'uuid';
import { UserResolver } from './resolvers/user';
import { User } from './entities/User';
import { A_DAY, COOKIE_NAME, __prod__ } from './constants';

dotEnvConfig({
  example: '.env',
});

const PORT = 4000;
const app = express();

async function main() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: true,
    synchronize: true,
    entities: [User],
  });

  await dataSource.initialize();

  const redisClient = redis.createClient();

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'microblog:',
  });

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: redisStore,
      secret: process.env.SESSION_SECRET || uuid.v4(),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: A_DAY * 7,
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__,
      },
    }),
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({
        req,
        res,
      }),
    }),
  );

  app.get('/', (_, res) => {
    res.send('Hello there');
  });

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

main().catch((err) => {
  console.error(err);
});
