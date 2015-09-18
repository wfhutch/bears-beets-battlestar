module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['../js/**/*.js']
    },

    watch: {
      javascripts: {
        files: ['../js/**/*.js'],
        tasks: ['jshint']
      },
		}
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint', 'watch']);
};