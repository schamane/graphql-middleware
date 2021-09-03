# Graphql Middleware

@schamane/graphql-middleware

middleware for [Apollo grapqhl server](https://www.apollographql.com/docs/apollo-server/) => 3.3.0 with websocket support for subscriptions based on express/polka

## Todo

- Authentication get working for context with WS and Graphql (typings)

## Add dependancy to project

```bash
npm i @schamane/@schamane/graphql-middleware
```

## Define app middleware

```ts
import { ApolloServer } from 'apollo-server-express';
import { TestBL } from '../bl/test';
import * as schemasDefs from '../schemas';
import { makeSchema, createGraphQlServer, initSubscriptionWSWihtCompatibility, DataSources, GrapqhContext } from '@schamane/graphql-middleware';
import type { Server } from 'http';


const schema = makeSchema(schemasDefs as any) as any;

const createDataSources = (): DataSources<GrapqhContext> => ({
  testApi: new TestBL()
});

export const initGraphQl = async (app: any): Promise<ApolloServer> => {
  const dataSources = createDataSources;

  const graphqlServer = createGraphQlServer(app, {
    schema,
    dataSources,
  }, {path: `/graphql`,});

  return graphqlServer;
};

export const initSubscriptions = (server: Server) => {
  const schema = makeSchema(schemasDefs as any) as any;
  return initSubscriptionWSWihtCompatibility(server, schema);
}
```

## Use middleware with express

```ts
import express, { Application } from 'express';

const PORT: string = process.env.PORT || '8081';

const app: Application = express();

const serverInitialize = async () => {
    app.get('/', (_, res) => {
    res.send({ msg: 'set api version for request' });
  });

  await initGraphQl(app);
  const server = app.listen(PORT, async () => {
    initSubscriptions(server);
    console.info(`Listening to port ${PORT}`);
  });
  return server;
};

export const server = serverInitialize();

```

## Use middleware with polka

```ts
import polka from 'polka';
import type { Polka } from 'polka';

const PORT: string = process.env.PORT || '8081';

const app: Polka = polka();

const serverInitialize = async () => {
    app.get('/', (_, res) => {
    res.send({ msg: 'set api version for request' });
  });

  await initGraphQl(app as any);
  const server = app.listen(PORT, async () => {
    initSubscriptions(server);
    console.info(`Listening to port ${PORT}`);
  }).server;
  return server;
};

export const server = serverInitialize();
```