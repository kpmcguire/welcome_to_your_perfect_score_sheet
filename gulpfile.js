/**
 * Settings
 * Turn on/off build features
 */

var settings = {
	clean: true,
	scripts: true,
	polyfills: true,
	styles: true,
	images: false,
	svgs: true,
	copy: true,
  reload: true,
  pug: true
};

/**
 * Paths to project folders
 */

var paths = {
	input: 'src/',
	output: 'dist/',
	scripts: {
		input: 'src/js/*',
		polyfills: '.polyfill.js',
		output: 'dist/js/'
	},
	styles: {
		input: 'src/sass/**/*.{scss,sass}',
		output: 'dist/css/'
	},
	svgs: {
		input: 'src/svg/*.svg',
		output: 'dist/svg/'
	},
	copy: {
		input: 'src/copy/**/*',
		output: 'dist/'
  },
  pug: {
    input: 'src/pug/**/*',
    output: 'dist/'
	},  
	fonts: {
		input: 'src/fonts/*',
		output: 'dist/fonts/'
	},
	images: {
		input: 'src/img/*',
		output: 'dist/img/'
	},	
	reload: './dist/'
};


/**
 * Gulp Packages
 */

// General
var {gulp, src, dest, watch, series, parallel} = require('gulp');
var del = require('del');
var flatmap = require('gulp-flatmap');
var lazypipe = require('lazypipe');
var rename = require('gulp-rename');
var uglifycss = require('gulp-uglifycss');
var pug = require('gulp-pug');

// Scripts
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var concat = require('gulp-concat');
var uglify = require('gulp-terser');
var optimizejs = require('gulp-optimize-js');

// Styles
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');

// SVGs
var svgmin = require('gulp-svgmin');

// BrowserSync
var browserSync = require('browser-sync');

var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

function swallowError(error) {

	// If you want details of the error in the console
	console.log(error.toString())

	this.emit('end')
}


/**
 * Gulp Tasks
 */

// Remove pre-existing content from output folders
var cleanDist = function (done) {

	// Make sure this feature is activated before running
	if (!settings.clean) return done();

	// Clean the dist folder
	del.sync([
		paths.output
	]);

	// Signal completion
	return done();

};

// Repeated JavaScript tasks
var jsTasks = lazypipe()
	.pipe(optimizejs)
	.pipe(dest, paths.scripts.output)
	.pipe(rename, {suffix: '.min'})
	.pipe(uglify)
	.pipe(optimizejs)
	.pipe(dest, paths.scripts.output);

// Lint, minify, and concatenate scripts
var buildScripts = function (done) {

	// Make sure this feature is activated before running
	if (!settings.scripts) return done();

	// Run tasks on script files
	src(paths.scripts.input)
		.pipe(flatmap(function(stream, file) {

			// If the file is a directory
			if (file.isDirectory()) {

				// Setup a suffix variable
				var suffix = '';

				// If separate polyfill files enabled
				if (settings.polyfills) {

					// Update the suffix
					suffix = '.polyfills';

					// Grab files that aren't polyfills, concatenate them, and process them
					src([file.path + '/*.js', '!' + file.path + '/*' + paths.scripts.polyfills])
						.pipe(concat(file.relative + '.js'))
						.pipe(jsTasks());

				}

				// Grab all files and concatenate them
				// If separate polyfills enabled, this will have .polyfills in the filename
				src(file.path + '/*.js')
					.pipe(concat(file.relative + suffix + '.js'))
					.pipe(jsTasks());

				return stream;

			}

			// Otherwise, process the file
			return stream.pipe(jsTasks());

		})
		.on('error', swallowError)
		);

	// Signal completion
	done();

};

// Lint scripts
var lintScripts = function (done) {

	// Make sure this feature is activated before running
	if (!settings.scripts) return done();

	// Lint scripts
	src(paths.scripts.input)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));

	// Signal completion
	done();

};

// Process, lint, and minify Sass files
var buildStyles = function (done) {

	// Make sure this feature is activated before running
	if (!settings.styles) return done();

	// Run tasks on all Sass files
	src(paths.styles.input)
		.pipe(sass({
			outputStyle: 'expanded',
			sourceComments: true
		}))
		.on('error', swallowError)
		.pipe(prefix({
			browsers: ['last 2 version', '> 0.25%'],
			cascade: true,
			remove: true
		}))
		.pipe(dest(paths.styles.output))
		.pipe(uglifycss({"maxLineLen": 80, "uglyComments": true}))
		.pipe(rename({suffix: '.min'}))
		.pipe(dest(paths.styles.output));

	// Signal completion
	done();

};

// Do pug
var buildPug = function (done) {

  // Make sure this feature is activated before running
  if (!settings.pug) return done();

  // Run tasks on all Sass files
  src(paths.pug.input)
		.pipe(pug())
		.on('error', swallowError)
    .pipe(dest(paths.pug.output));

  // Signal completion
  done();

};

var minimizeImages = function(done) {
	if (!settings.images) return done();
	src(paths.images.input)
		.pipe(cache(imagemin({
				interlaced: true
		})))
		.pipe(dest(paths.images.output));
		done();
};

// Optimize SVG files
var buildSVGs = function (done) {

	// Make sure this feature is activated before running
	if (!settings.svgs) return done();

	// Optimize SVG files
	src(paths.svgs.input)
		.pipe(svgmin())
		.pipe(dest(paths.svgs.output));

	// Signal completion
	done();

};

// Copy static files into output folder
var copyFiles = function (done) {

	// Make sure this feature is activated before running
	if (!settings.copy) return done();

	// Copy static files
	src(paths.copy.input)
		.pipe(dest(paths.copy.output));

	// Signal completion
	done();

};

// Watch for changes to the src directory
var startServer = function (done) {

	// Make sure this feature is activated before running
	if (!settings.reload) return done();

	// Initialize BrowserSync
	browserSync.init({
		server: {
			baseDir: paths.reload
		}
	});

	// Signal completion
	done();

};

// Reload the browser when files change
var reloadBrowser = function (done) {
	if (!settings.reload) return done();
	browserSync.reload();
	done();
};

// Watch for changes
var watchSource = function (done) {
	watch(paths.input, series(exports.default, reloadBrowser));
	done();
};

var copyRequiredFiles = function(done) {
  src(paths.fonts.input).pipe(dest(paths.fonts.output));
	src(paths.images.input).pipe(dest(paths.images.output));
  done();
};


/**
 * Export Tasks
 */

// Default task
// gulp
exports.default = series(
  cleanDist,
	copyRequiredFiles,
	parallel(
		buildScripts,
		lintScripts,
		buildStyles,
    buildSVGs,
		buildPug
	)
);

// Watch and reload
// gulp watch
exports.watch = series(
	exports.default,
	startServer,
	watchSource
);