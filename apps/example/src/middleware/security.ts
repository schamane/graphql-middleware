import { initCors } from '@schamane/graphql-middleware-security/cors';
import { MockStrategy } from '@schamane/graphql-middleware-security/mockStrategy';
import passport, { Strategy } from 'passport';
import type { Application } from 'express';

const LocalUser = { id: 'local@security', groups: [] };

const createLocalStrategy = (): Strategy => {
  return new MockStrategy((userId: string, done: (a: unknown, b: any) => void): void => {
    done(null, LocalUser);
  });
};

export function initSecurity(app: Application) {
  const stragegy = createLocalStrategy();
  passport.use(stragegy);
  app.use(passport.initialize());
  initCors(app);
}
