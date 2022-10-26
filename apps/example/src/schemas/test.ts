import { hostname, arch, cpus } from 'node:os';
import { inspect } from 'node:util';
import { gql } from 'graphql-tag';
import type { IResolvers } from '@graphql-tools/utils';
import { API } from '../config/api.js';
import { ContextValue } from '../middleware/graphql.js';

const typeDef = gql`
  type Query {
    api: ApiInfo!
    context: String!
    dataSource: [String]!
  }

  type ApiInfo {
    instance: ID!
    version: String!
    name: String!
    arch: String!
    cpuinfo: [CpuInfo]!
  }

  type CpuInfo {
    model: String!
    speed: Int!
  }
`;

const resolvers: IResolvers<ContextValue> = {
  Query: {
    api: (): Record<string, unknown> => ({ instance: hostname(), arch: arch(), cpuinfo: cpus(), ...API }),
    context: (parent, params, ctx) => inspect(ctx),
    dataSource: (parent, params, ctx) => [inspect(ctx)]
  }
};

export const TestSchema = { typeDef, resolvers };
