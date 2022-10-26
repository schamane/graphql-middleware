import { initApolloGraphql as init } from '@schamane/graphql-middleware';
import { makeSchema, loadSchemas } from '@schamane/graphql-middleware/tools';
import { Application, json } from 'express';
import passport from 'passport';
import { ApiSchema } from '../schemas/api.js';

export interface ContextValue {
  id: string;
  groups: string[];
  dataSources: Record<string, unknown>;
}

const initDataSources = async (context: any): Promise<Record<string, unknown>> => {
  await console.log('init all  datasources with index', context);
  return {
    x: new Error('not Implemented')
  };
};

export async function initApolloGraphql(app: Application) {
  const apis = await loadSchemas(['../schemas/api.js', '../schemas/api.js']);
  console.log('import', apis);
  const schema = await makeSchema(ApiSchema.typeDef, ApiSchema.resolvers);
  const { middleware } = await init<ContextValue>(app, schema, initDataSources);
  app.use('/1/graphql', passport.authenticate('mock', { session: false }), json(), middleware);
}
