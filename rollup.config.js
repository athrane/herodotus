import { babel } from '@rollup/plugin-babel';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'es',
  },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
  ],
};