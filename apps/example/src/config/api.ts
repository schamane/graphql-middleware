import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { inspect } from 'node:util';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(readFileSync(join(__dirname, '/../../', 'package.json')).toString());

export const API = {
  name: pkg.name,
  version: pkg.version
};

// eslint-disable-next-line no-console
console.info('Package Info: 👉️', inspect(API));
