import express, { Application } from 'express';
import { initSecurity } from './middleware/security.js';
import { initApolloGraphql } from './middleware/graphql.js';

const PORT: string = process.env.PORT || '8081';

const serverInitialize = async (app: Application) => {
  initSecurity(app);
  await initApolloGraphql(app);

  const server = app.listen(PORT, (): void => {
    // eslint-disable-next-line no-console
    console.info(`Listening to port ${PORT}`);
  });
  return { app, server };
};

const app = express();
serverInitialize(app);

export default app;
