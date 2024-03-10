import { ApolloServer } from '@apollo/server';
import { config as dotEnvConfig } from 'dotenv-safe';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import redis from 'ioredis';
import session from 'express-session';
import RedisStore from 'connect-redis';
import uuid from 'uuid';
import { UserResolver } from './resolvers/user';
import { A_DAY, COOKIE_NAME, __prod__ } from './constants';
import dataSource from './dataSource';

dotEnvConfig({
  example: '.env',
});

const PORT = 4000;
const app = express();

async function main() {
  await dataSource.initialize();

  const redisClient = redis.createClient();

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'microblog:',
  });

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
    cors<cors.CorsRequest>({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({
        req,
        res,
      }),
    }),
  );

  app.get('/', (_, res) => {
    res.send({
      up: true,
      name: 'microblog-app-server',
    });
  });

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

main().catch((err) => {
  console.error(err);
});
