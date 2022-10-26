import { createServer } from 'node:http';
import type { Application, RequestHandler } from 'express';
import type { GraphQLSchema } from 'graphql/type';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

type Context = { id: string; groups?: string[]; datasource?: Record<string, unknown> };

export type InitApolloGraphqlServer<T extends Context> = { server: ApolloServer<T>; middleware: RequestHandler };

export async function initApolloGraphql<T extends Context>(
  app: Application,
  schema: GraphQLSchema,
  dataSources?: (context: T) => Promise<Record<string, unknown>>
): Promise<InitApolloGraphqlServer<T>> {
  const httpServer = createServer(app);
  const server = new ApolloServer<T>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });

  await server.start();

  const createContext = async (user: any): Promise<T> => {
    const context = (await { ...user, groups: [] }) as T;
    const dataSourcesInstances = dataSources ? await dataSources(context) : undefined;
    return {
      ...context,
      dataSources: dataSourcesInstances
    };
  };

  const middleware = expressMiddleware(server, {
    context: async ({ req }) => createContext((req as any)?.user)
  });

  return { server, middleware };
}
