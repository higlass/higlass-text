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
            provider: 'playwright',
            headless: true,
            instances: [
              {
                browser: 'chromium',
                launch: { channel: 'chrome', args: CHROME_ARGS },
              },
            ],
          },
        },
      },
    ],
  },
});
