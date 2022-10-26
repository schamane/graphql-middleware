import { resolve } from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/build-options.html#build-lib
export default defineConfig(() => ({
  plugins: [
    eslint(),
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    outDir: 'dist',
    target: 'node12',
    lib: {
      entry: undefined,
      fileName: 'graphql-middleware-security-[name]',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      input: [resolve(__dirname, 'src', 'mockStrategy.ts'), resolve(__dirname, 'src', 'cors.ts'), resolve(__dirname, 'src', 'index.ts')],
      external: ['util', 'node:util', 'process', 'node:process', 'events', 'node:events', 'cors', 'passport']
    },
    sourcemap: true,
    emptyOutDir: false
  }
}));
