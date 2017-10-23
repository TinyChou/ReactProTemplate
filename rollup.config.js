// this is the rollup plugin that adds babel as a compilation stage.
import babel from 'rollup-plugin-babel';

// when importing packages, rollup does its best to figure out
// what is being exported from modules designed for commonjs. This process
// is imperfect and there are times that you need to manually specify what
// symbols should be imported.
import commonjs from 'rollup-plugin-commonjs'

// this is needed to allow rollup to find modules in the node_modules directory.
import nodeResolve from 'rollup-plugin-node-resolve'

// this is a minification stage. It does some code rewriting. There are
// alternatives, like using closure. But this one seems to work best.
import uglify from 'rollup-plugin-uglify'

// This is a simple utility plugin that allows you to make changes in the
// output code. Sometimes after all bundling is complete, you need to make some
// final patches to make the code work.
import replace from 'rollup-plugin-replace'

export default {
   // this is the entry point for your script. All the other code that
   // gets included will come from import statements.
   entry:  'main.js',

   // this is the output file.
   dest:   'build/main.js',

   // this is the output format. iife is best for web apps meant to run in a
   // browser. iife means that the script is packaged as a self contained self
   // executing function.
   format: 'iife',

   // this section configures each of the plugins imported above
   plugins:
   [
      // tell babel not to compile stuff out of node_modules. I think this
      // makes the compilation step run faster.
      babel({
         exclude: 'node_modules/**'
      }),
      nodeResolve({
        jsnext: true
      }),

      commonjs({

         // where to search for modules when you import them. if the
         // module path is not given explicitly, rollup will search
         // for them here.
         include: 'node_modules/**',

         // this is where you patch modules that don't export their symbols
         // cleanly.
         namedExports:
         {
            // react appears to be one of those. Either that, or I'm not
            // importing it correctly in my code. Regardless this is an
            // example of telling rollup to extract the following symbols
            // from a package as if they were exported.
            './node_modules/react/index.js':
            [
               'cloneElement',
               'createElement',
               'PropTypes',
               'Children',
               'Component'
            ],
            './node_modules/react-dom/index.js':
            [
              'render'
            ]
         }
      }),

      // If you don't patch this the "process" symbol required by react will
      // not be defined. All you need to do here is set that string to either
      // 'development' or 'production' depending on which kind of build you
      // are making.
      replace({
         'process.env.NODE_ENV': JSON.stringify( 'production' )
      }),

      // configuration for the uglify minifier.
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
