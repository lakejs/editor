import path from 'path';
import { fileURLToPath } from 'url';
import alias from '@rollup/plugin-alias';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import svg from 'rollup-plugin-svg-import';
import css from 'rollup-plugin-import-css';
import terser from '@rollup/plugin-terser';

const rootPath = path.dirname(fileURLToPath(import.meta.url));

const aliasOptions = {
  entries: [
    { find: 'lakelib', replacement: path.resolve(rootPath, 'src') },
  ],
};

function getBundleConfig(type) {
  const globals = {
    'photoswipe/lightbox': 'PhotoSwipeLightbox',
    photoswipe: 'PhotoSwipe',
  };
  const external = [
    'photoswipe/style.css',
    'photoswipe/lightbox',
    'photoswipe',
  ];
  if (type === 'tests') {
    globals.sinon = 'sinon';
    external.push('sinon');
  }
  return {
    input: `./${type}/index.ts`,
    output: {
      file: `./temp/${type}/bundle.js`,
      format: 'iife',
      sourcemap: true,
      globals,
      assetFileNames: 'bundle.css',
    },
    external,
    watch: {
      include: [
        'src/**',
        `${type}/**`,
      ],
    },
    plugins: [
      alias(aliasOptions),
      nodeResolve(),
      typescript({
        compilerOptions: {
          outDir: './temp',
        },
      }),
      commonjs(),
      json(),
      svg({
        stringify: true,
      }),
      css(),
    ],
  };
}

function getBuildConfig(type) {
  if (type === 'iife') {
    return {
      input: './src/index.ts',
      output: {
        file: './dist/lake.min.js',
        format: 'iife',
        name: 'Lake',
        sourcemap: true,
        plugins: [terser()],
        assetFileNames: 'lake.css',
      },
      watch: {
        include: [
          'src/**',
        ],
      },
      plugins: [
        alias(aliasOptions),
        nodeResolve(),
        typescript({
          compilerOptions: {
            outDir: './dist',
          },
        }),
        commonjs(),
        json(),
        svg({
          stringify: true,
        }),
        css(),
      ],
    };
  }
  return {
    input: './src/index.ts',
    output: {
      file: './lib/lake.js',
      format: 'es',
      sourcemap: true,
      assetFileNames: 'lake.css',
    },
    watch: {
      include: [
        'src/**',
      ],
    },
    plugins: [
      alias(aliasOptions),
      typescript({
        compilerOptions: {
          outDir: './lib',
          rootDir: './src',
          declaration: true,
          declarationDir: './lib',
        },
      }),
      commonjs(),
      json(),
      svg({
        stringify: true,
      }),
      css(),
    ],
  };
}

function getTestLibConfig(name) {
  return {
    input: `./tests/${name}.ts`,
    output: {
      file: `./temp/tests/${name}.js`,
      format: 'iife',
      sourcemap: true,
    },
    watch: {
      include: [
        `tests/${name}.ts`,
      ],
    },
    plugins: [
      nodeResolve(),
      typescript({
        compilerOptions: {
          outDir: './temp',
        },
      }),
      commonjs(),
    ],
  };
}

export default (commandLineArgs) => {
  const configList = [];
  if (commandLineArgs.example === true) {
    delete commandLineArgs.example;
    configList.push(getBundleConfig('examples'));
  }
  if (commandLineArgs.test === true) {
    delete commandLineArgs.test;
    configList.push(getTestLibConfig('chai'));
    configList.push(getBundleConfig('tests'));
  }
  if (commandLineArgs.iife === true) {
    delete commandLineArgs.iife;
    configList.push(getBuildConfig('iife'));
  }
  if (commandLineArgs.es === true) {
    delete commandLineArgs.es;
    configList.push(getBuildConfig('es'));
  }
  return configList;
};
