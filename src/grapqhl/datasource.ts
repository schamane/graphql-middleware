import type { DataSource } from 'apollo-datasource';

export type DataSources<TContext> = {
  [name: string]: DataSource<TContext>;
};

export type ApolloServerDataSources<TContext = any> = () => DataSources<TContext>;
