import type { GraphQLSchema } from 'graphql/type';
import type { IResolvers } from '@graphql-tools/utils';
import { makeExecutableSchema } from '@graphql-tools/schema';

export function makeSchema(typeDefs: any, resolvers: IResolvers): GraphQLSchema {
  return makeExecutableSchema({ typeDefs, resolvers });
}
