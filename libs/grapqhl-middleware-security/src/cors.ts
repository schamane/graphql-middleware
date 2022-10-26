import type { Application } from 'express';
import cors, { CorsOptions } from 'cors';

export function initCors(app: Application, config?: CorsOptions): void {
  app.use(cors(config));
}
