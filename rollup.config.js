import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.js',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
};
