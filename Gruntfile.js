module.exports = function (grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    watch: {
      // If any files change, run tasks
      files: ['build/less/*.less', 'build/less/skins/*.less', 'dist/js/*.js'],
      tasks: ['less:development', 'uglify:jsDev', 'uglify:angularDev', 'concat']
    },

    // 'less'-task configuration
    // This task will compile all less files upon saving to create both AdminLTE.css and AdminLTE.min.css
    less: {
      // Development not compressed
      development: {
        options: {
          compress: false
        },
        files: {
          // compilation.css  :  source.less
          'dist/css/AdminLTE.css': 'build/less/AdminLTE.less',
          'dist/css/custom.css': 'build/less/custom/custom.less',
          'dist/css/override.css': 'build/less/custom/override.less',
          //Non minified skin files
          'dist/css/skins/skin-blue.css': 'build/less/skins/skin-blue.less',
          'dist/css/skins/skin-black.css': 'build/less/skins/skin-black.less',
          'dist/css/skins/skin-yellow.css': 'build/less/skins/skin-yellow.less',
          'dist/css/skins/skin-green.css': 'build/less/skins/skin-green.less',
          'dist/css/skins/skin-red.css': 'build/less/skins/skin-red.less',
          'dist/css/skins/skin-purple.css': 'build/less/skins/skin-purple.less',
          'dist/css/skins/skin-blue-light.css': 'build/less/skins/skin-blue-light.less',
          'dist/css/skins/skin-black-light.css': 'build/less/skins/skin-black-light.less',
          'dist/css/skins/skin-yellow-light.css': 'build/less/skins/skin-yellow-light.less',
          'dist/css/skins/skin-green-light.css': 'build/less/skins/skin-green-light.less',
          'dist/css/skins/skin-red-light.css': 'build/less/skins/skin-red-light.less',
          'dist/css/skins/skin-purple-light.css': 'build/less/skins/skin-purple-light.less',
          'dist/css/skins/_all-skins.css': 'build/less/skins/_all-skins.less'
        }
      },
      // Production compresses version
      production: {
        options: {
          compress: true
        },
        files: {
          // compilation.css  :  source.less
          'dist/css/AdminLTE.min.css': 'build/less/AdminLTE.less',
          'dist/css/custom.min.css': 'build/less/custom/custom.less',
          'dist/css/override.min.css': 'build/less/custom/override.less',
          // Skins minified
          'dist/css/skins/skin-blue.min.css': 'build/less/skins/skin-blue.less',
          'dist/css/skins/skin-black.min.css': 'build/less/skins/skin-black.less',
          'dist/css/skins/skin-yellow.min.css': 'build/less/skins/skin-yellow.less',
          'dist/css/skins/skin-green.min.css': 'build/less/skins/skin-green.less',
          'dist/css/skins/skin-red.min.css': 'build/less/skins/skin-red.less',
          'dist/css/skins/skin-purple.min.css': 'build/less/skins/skin-purple.less',
          'dist/css/skins/skin-blue-light.min.css': 'build/less/skins/skin-blue-light.less',
          'dist/css/skins/skin-black-light.min.css': 'build/less/skins/skin-black-light.less',
          'dist/css/skins/skin-yellow-light.min.css': 'build/less/skins/skin-yellow-light.less',
          'dist/css/skins/skin-green-light.min.css': 'build/less/skins/skin-green-light.less',
          'dist/css/skins/skin-red-light.min.css': 'build/less/skins/skin-red-light.less',
          'dist/css/skins/skin-purple-light.min.css': 'build/less/skins/skin-purple-light.less',
          'dist/css/skins/_all-skins.min.css': 'build/less/skins/_all-skins.less'
        }
      }
    },

    // Concatenate CSS files into build.css
    concat: {
      css: {
        src: [
          'node_modules/bootstrap/dist/css/bootstrap.min.css',
          'dist/css/AdminLTE.min.css',
          'node_modules/icheck/skins/flat/blue.css',
          'dist/css/custom.min.css',
          'dist/css/override.min.css',
          'dist/css/skins/skin-red.min.css',
          'node_modules/font-awesome/css/font-awesome.min.css',
          'node_modules/datatables.net-bs/css/dataTables.bootstrap.css'
          // ,'node_modules/ionicons/dist/css/ionicons.min.css'
        ],
        dest: 'public/build.css',
        nonull: true
      },
      angular: {
        src: [
          // Load files in specific order
          'build/app/main.js',
          'build/app/filters/*.js',
          'build/app/services/*.js',
          'build/app/components/**/*.js'
        ],
        dest: 'public/ng.min.js',
        nonull: true
      },
      plugins: {
        src: [
          'node_modules/jquery/dist/jquery.js',
          'node_modules/bootstrap/dist/js/bootstrap.js',
          'node_modules/admin-lte/dist/js/adminlte.min.js',
          'node_modules/fastclick/lib/fastclick.js',
          'node_modules/alertify.js/dist/js/alertify.js',
          'node_modules/slimscroll/example/ssmaster/jquery.slimscroll.js',
          'node_modules/icheck/icheck.js',
          'build/js/google-analytics.js',
          'node_modules/dimple/dist/dimple.latest.js',
          'node_modules/angular/angular.js',
          'node_modules/angular-dimple/dist/angular-dimple.js',
          'node_modules/datatables.net/js/jquery.dataTables.js',
          'node_modules/datatables.net-bs/js/dataTables.bootstrap.js',
          'node_modules/angular-datatables/dist/angular-datatables.js'
        ],
        dest: 'public/plugins.min.js',
        nonull: true
      }
    },

    // Minified js files
    'uglify': {
      angular: {
        options: {
          mangle: false
        },
        src: 'public/ng.min.js',
        dest: 'public/ng.min.js'
      },
      plugins: {
        options: {
          mangle: false
        },
        src: 'public/plugins.min.js',
        dest: 'public/plugins.min.js'
      }
    },

    // Minified css files
    'cssmin': {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      build: {
        files: {
          'public/build.css': 'public/build.css'
        }
      }
    },

    // Validate JS code
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      core: {
        src: 'public/js/app.js'
      },
      demo: {
        src: 'public/js/demo.js'
      }
    },

    // Validate CSS files
    csslint: {
      options: {
        csslintrc: 'build/less/.csslintrc'
      },
      dist: [
        'dist/css/AdminLTE.css'
      ]
    },

    // Validate Bootstrap HTML
    bootlint: {
      options: {
        relaxerror: ['W005','E001','W001','W002','W003']
      },
      files: ['views/*.html', 'views/**/*.html']
    },

    // Copy dependencies to public folder
    copy: {
      d3: {
        nonull: true,
        src: 'node_modules/d3/d3.min.js',
        dest: 'public/d3.min.js'
      },
      fa: {
        nonull: true,
        expand: true,
        cwd: 'node_modules/font-awesome/fonts/',
        src: ['*.eot', '*.svg', '*.ttf', '*.woff', '*.woff2', '*.otf'],
        dest: 'public/fonts/'
      },
      /*
      ion: {
        nonull: true,
        expand: true,
        cwd: 'node_modules/ionicons/dist/fonts',
        src: ['*.eot', '*.svg', '*.ttf', '*.woff', '*.woff2'],
        dest: 'public/fonts/'
      },
      */
      icheck: {
        nonull: true,
        expand: true,
        cwd: 'node_modules/icheck/skins/flat',
        src: ['blue*.png'],
        dest: 'public/'
      },
      bs: {
        nonull: true,
        expand: true,
        cwd: 'node_modules/bootstrap/fonts/',
        src: '**',
        dest: 'public/fonts/'
      }
    },

    'concurrent': {
      concat: {
        tasks: ['concat:css', 'concat:angular', 'concat:plugins'],
        options: {
          logConcurrentOutput: true
        }
      },
      compress: {
        tasks: ['uglify:angular', 'uglify:plugins', 'cssmin:build'],
        options: {
          logConcurrentOutput: true
        }
      }
    }

  });

  // Linting task
  grunt.registerTask('lint', ['jshint', 'csslint', 'bootlint']);

  // Task that runs on npm install
  grunt.registerTask('default', ['less:production', 'concurrent:concat', 'concurrent:compress', 'copy']);

  // Dev task. Dont compress files
  grunt.registerTask('dev', ['less:development', 'concurrent:concat', 'copy']);

};
