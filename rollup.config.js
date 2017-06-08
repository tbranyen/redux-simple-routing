import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import Visualizer from 'rollup-plugin-visualizer';

const { NODE_ENV = 'umd' } = process.env;

export const exports = 'named';
export const context = 'this';
export const entry = 'index.js';
export const sourceMap = false;
export const external = ['react', 'prop-types', 'route-parser'];
export const moduleName = 'reduxSimpleRouting';

export const targets = [{
  dest: 'dist/redux-simple-routing.js',
  format: 'umd',
}];

export const plugins = [
  NODE_ENV === 'production' && replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  babel(),
  nodeResolve({ jsnext: true }),
  commonjs(),
  Visualizer({ filename: './dist/build-size.html' }),
];
