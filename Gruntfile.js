/*global module*/
module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            development: {
                files: {
                    'src/css/main.css': 'src/sass/main.scss'
                }
            }
        },
        connect: {
            server: {
                options: {
                    base: 'src',
                    hostname: '*',
                    port: 1337,
                    useAvailablePort: true
                }
            }
        },
        watch: {
            styles: {
                files: ['src/sass/**/*.scss'],
                tasks: ['sass']
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: ['src/**/*.*', '!src/sass/*']
            }
        }
    });
    grunt.registerTask('default', ['sass', 'connect', 'watch']);
};
