import { ApolloServer } from '@apollo/server';
import { config as dotEnvConfig } from 'dotenv-safe';
import express from 'express';
import { DataSource } from 'typeorm';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import { HelloResolver } from './resolvers/hello';

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
  });

  await dataSource.initialize();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
  });

  await apolloServer.start();

  app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(apolloServer));

  app.get('/', (_, res) => {
    res.send('Hello there');
  });

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

main().catch(err => {
  console.error(err);
});
