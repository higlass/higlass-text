import { playwright } from '@vitest/browser-playwright';

const CHROME_ARGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'];

/** @type {import("vite").UserConfigFnObject} */
export default ({ mode }) => ({
  define: {
    // Required by some HiGlass dependencies when running the demo and tests.
    global: 'globalThis',
  },
  build:
    mode === 'umd'
      ? {
          // Script tag build that registers the track when loaded.
          emptyOutDir: false,
          lib: {
            entry: 'src/umd.js',
            name: 'higlass-text',
            formats: ['umd'],
            fileName: () => 'higlass-text.js',
          },
          rollupOptions: { output: { exports: 'named' } },
        }
      : {
          target: 'es2020',
          sourcemap: true,
          lib: {
            entry: 'src/index.js',
            formats: ['es'],
            fileName: () => 'higlass-text.mjs',
          },
        },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['test/unit/**/*.test.js'],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['test/browser/**/*.test.js'],
          browser: {
            enabled: true,
            // Uses the installed Google Chrome, so no browser download is needed.
            provider: playwright({
              launchOptions: { channel: 'chrome', args: CHROME_ARGS },
            }),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
