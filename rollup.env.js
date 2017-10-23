import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'

var productionConfig =
{
   entry:  'status-react.jsx',
   dest:   '../files/status-react.js',
   format: 'iife',
   plugins:
   [
      babel({
         exclude: 'node_modules/**'
      }),
      nodeResolve({
        jsnext: true
      }),
      commonjs({
         include: 'node_modules/**',
         namedExports:
         {
            './node_modules/react/react.js':
            [ 'cloneElement', 'createElement', 'PropTypes',
              'Children', 'Component' ],
         }
      }),
      replace({
         'process.env.NODE_ENV': JSON.stringify( 'production' )
      }),
      uglify({
         compress: {
            screw_ie8: true,
            warnings: false
         },
         output: {
            comments: false
         },
         sourceMap: false
      })
   ]
}

var developmentConfig =
{
   name: 'bell',
   input:  'main.js',
   output:   {
     file: 'build/main.js',
     format: 'iife'
   },
   plugins:
   [
      babel({
         exclude: 'node_modules/**'
      }),
      nodeResolve({
        jsnext: true
      }),
      commonjs({
         include: 'node_modules/**',
         exclude: [
           'node_modules/process-es6/**'
         ],
         namedExports:
         {
           'node_modules/react/index.js': ['Children', 'Component', 'PropTypes', 'createElement'],
           'node_modules/react-dom/index.js': ['render']
         }
      }),
      replace({
         'process.env.NODE_ENV': JSON.stringify( 'development' )
      })
   ]
}

export default developmentConfig;
