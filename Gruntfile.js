module.exports = function(grunt) {

  grunt.initConfig({

    concurrent: {
      dev: {
        tasks: ['shell:nodemon', 'watch:react'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'server.js', 'server/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },

    watch: {
      jshint: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint']
      },
      react: {
        files: ['client/routes/*.js', 'client/scripts/*.js'],
        tasks:['browserify']
      }
    },

    browserify:     {
      options:      {
        transform:  [ require('grunt-react').browserify ]
      },
      app:          {
        src:        'client/scripts/index.js',
        dest:       'public/scripts/index.js'
      }
    },

    shell: {
      nodemon: {
          command: 'nodemon server.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('serve', [
    'browserify',
    'concurrent:dev'
  ]);

  grunt.registerTask('default', [
    'browserify',
    'concurrent:dev'
  ]);

};