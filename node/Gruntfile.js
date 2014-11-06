module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochacli: {
            options: {
                require: [],
                reporter: 'spec',
                bail: true,
                timeout: 2000000
            },
            oneway: {
                src: ['phantom/app.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test:one-way', ['mochacli:oneway']);
};
