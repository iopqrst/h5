module.exports = function(grunt) {
	var transport = require('grunt-cmd-transport');
	var style = transport.style.init(grunt);
	var text = transport.text.init(grunt);
	var script = transport.script.init(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		transport: {
			options: {
				paths: ['.'],
				alias: '<%= pkg.spm.alias %>'
			},
			common: {
				options: {
					idleading: ''
				},

				files: [{
					cwd: 'template/scripts/',
					src: '**/*',
					filter: 'isFile',
					dest: '.build/dist/common'
				}]
			}
		},

		uglify: {
			common: {
				options: {
					banner: '/*! <%= pkg.author %> | <%= pkg.version %>*/',
					beautify: {
						ascii_only: true
					}
				},
				files: [{
					expand: true,
					cwd: 'template/scripts',
					src: ['**/**.js','!*-debug.js','!mobiscroll*.js'],
					dest: 'template/min',
					ext: '.min.js'
				}]
			},
			mobiscroll: {
				options: {
					banner: '/*! <%= pkg.author %> | <%= pkg.version %>*/',
					beautify: {
						ascii_only: true
					}
				},
				files: [{
					expand: true,
					cwd: 'template/scripts/lib/mobiscroll/js',
					src: ['mobiscroll.core.js','mobiscroll.datetime.js','mobiscroll.scroller.android-ics.js','mobiscroll.scroller.js','mobiscroll.zepto.js','mobiscroll.i18n.zh.js'],
					dest: 'template/min/lib/mobiscroll/js/',
					ext: '.min.js'
				}]
			}
		},

		copy: {
			base: {
				files: [{
					expand: true,
					src: ['sea.js'],
					dest: '../<%= pkg.version %>/'
				}, {
					expand: true,
					src: ['sconfig.js'],
					dest: '../<%= pkg.version %>/'
				}]
			}
		},
		cssmin: {
			combine: {
				options: {
					banner: '/* My minified css file */'
				},
				files: {
					'template/styles/base.css': ['template/styles/reset.css',
						'template/styles/app.css', 'template/styles/animation.css',
						'template/styles/units.css', 'template/styles/modules.css',
						'template/styles/page.css', 'template/scripts/lib/mobiscroll/css/mobiscroll.animation.css',
						'template/scripts/lib/mobiscroll/css/mobiscroll.scroller.android-ics.css', 'template/scripts/lib/mobiscroll/css/mobiscroll.scroller.css'
					]
				}
			},
			minify: {
				expand: true,
				cwd: 'template/styles/',
				src: ['base.css', '!*.min.css'],
				dest: 'template/styles/',
				ext: '.min.css'
			}
		},
		clean: {
			build: ['.build']
		}
	});

	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-cmd-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	//	grunt.registerTask('default', [ 'transport:common','transport:jplugin',
	//	                                'transport:cp', 'transport:mp','uglify:common', 
	//	                                'uglify:jplugin','uglify:cp', 'uglify:mp',
	//	                                'copy:base','uglify:sconfig','clean' ]);
	//	grunt.registerTask('default', ['concat']);
	//grunt.registerTask('default', ['cssmin:combine', 'cssmin:minify']);
	grunt.registerTask('default', ['uglify:common','uglify:mobiscroll']);
};