/*jshint node: true */

'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    qunit: {
      all: ['test/index.html']
    },
    jshint: {
      files: [
      'Gruntfile.js',
      'jquery.bootstrap-dialogs.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */\n'
      },
      build: {
        files: {
          'build/jquery.bootstrap-dialogs-<%= pkg.version %>.min.js': 'jquery.bootstrap-dialogs.js'
        }
      }
    },
    watch: {
      files: [
        'jquery.bootstrap-dialogs.js',
        'test/tests.js'
      ],
      tasks: 'default'
    },
    compare_size: {
      files: [
        'build/jquery.bootstrap-dialogs-<%= pkg.version %>.min.js',
        'jquery.bootstrap-dialogs.js'
      ],
      options: {
        compress: {
          gz: function (fileContents) {
            return require('gzip-js').zip(fileContents, {}).length;
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-compare-size');

  grunt.registerTask('default', ['jshint', 'qunit', 'uglify', 'compare_size']);
  grunt.registerTask('ci', ['jshint', 'qunit']);
};
