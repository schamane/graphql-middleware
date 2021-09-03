import { compact, map, merge } from 'lodash';
import type { ApolloServerExpressConfig, ExpressContext, ServerRegistration } from 'apollo-server-express';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { Application } from 'express';
import type { Server } from 'http';
import type { IResolvers } from '@graphql-tools/utils';
import type { GraphQLSchema } from 'graphql/type';
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import ws from 'isomorphic-ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import type { DataSource } from 'apollo-datasource';
import { routeGrapqhlWS } from './ws';

export type GrapqhContext = {
  id: string;
  groups: string[];
  dataSources: Record<string, DataSource>;
};

const transformSchemaWithDirectives = (schema: GraphQLSchema, transformations: ((schema: GraphQLSchema) => GraphQLSchema)[]) => {
  let newSchema = schema;
  map(transformations, (fn) => {
    newSchema = fn(newSchema);
  });
  return newSchema;
};

export const makeSchema = (schemasDefsAll: unknown[]): GraphQLSchema => {
  const typeDefs = compact(map(schemasDefsAll, 'typeDef'));
  const schemaDirectives = merge({}, ...compact(map(schemasDefsAll, 'schemaDirectives')));
  const resolvers = compact<IResolvers>(merge(map(schemasDefsAll, 'resolvers')));
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });
  // shema directices https://www.graphql-tools.com/docs/schema-directives
  return transformSchemaWithDirectives(schema, schemaDirectives);
};

export interface GraphQlServerOptions extends ApolloServerExpressConfig {
  playground?: boolean;
}

export const createGraphQlServer = async (app: Application, graphqlOptions: GraphQlServerOptions, serverOptions: Partial<ServerRegistration>): Promise<ApolloServer<ExpressContext>> => {
  const plugins = graphqlOptions.plugins ? graphqlOptions.plugins : [];
  const graphqlServer = new ApolloServer({
    ...graphqlOptions,
    plugins: [process.env.NODE_ENV === 'production' && graphqlOptions.playground !== true ? ApolloServerPluginLandingPageDisabled() : ApolloServerPluginLandingPageGraphQLPlayground(), ...plugins]
  });
  await graphqlServer.start();
  graphqlServer.applyMiddleware({ app, ...serverOptions });
  return graphqlServer;
};

export const initSubscriptionWS = (server: Server, graphQlServer: ApolloServer, schema: GraphQLSchema): ws.Server => {
  const wsServer = new ws.Server({
    server,
    path: graphQlServer.graphqlPath
  });

  useServer({ schema }, wsServer);
  return wsServer;
};

export const initSubcriptionServer = (server: Server, graphQlServer: ApolloServer, schema: GraphQLSchema, authFn?: (...args: unknown[]) => unknown): SubscriptionServer => {
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect() {
        return authFn ? authFn() : undefined;
      }
    },
    {
      server,
      path: graphQlServer.graphqlPath
    }
  );
  return subscriptionServer;
};

export const initSubscriptionWSWihtCompatibility = (server: Server, schema: GraphQLSchema, authFn?: (...args: unknown[]) => unknown): void => {
  const wsServer = new ws.Server({ noServer: true });
  const subTransWs = new ws.Server({ noServer: true });

  useServer({ schema }, wsServer);

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect() {
        return authFn ? authFn() : undefined;
      }
    },
    subTransWs
  );

  server.on('upgrade', routeGrapqhlWS(subTransWs, wsServer));
};
