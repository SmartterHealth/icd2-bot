const gulp = require('gulp');
const del = require('del');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const nodemon = require('gulp-nodemon');
const ziplib = require('gulp-zip');
var bump = require('gulp-bump');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');

/**
 * Increments the build version by 1. Use the --nopatch flag to supress.
 */
const patch = function() {
    return gulp.src('./package.json')
        .pipe(gulpif(!argv.nopatch, bump()))
        .pipe(gulp.dest('./'));
}
patch.description = 'Increments the build version by 1. Use the --nopatch flag to supress.';

/**
 * Copies all non-typescript files into output directory.
 */
function copy() {
    return gulp.src(['./src/**/*.json'])
        .pipe(gulp.dest('./lib'));
}
copy.description = 'Copies all non-typescript files into output directory.';

/**
 * Cleans all compiled TypeScript files.
 */
const clean = function() {
    return del('./lib');
}
clean.description = 'Cleans all compiled TypeScript files.';

/**
 * Converts README.docx to README.md (markdown).
 */
const docs = function() {
    // REQUIRES pandoc!!! https://pandoc.org/MANUAL.html
    return exec('pandoc -s README.docx -t markdown -o README.md')
}
docs.description = 'Converts README.docx to README.md (markdown).';

/**
 * Compiles all TypeScript.
 */
const tsc = function() {
    return exec('tsc');
}
tsc.description = "Compiles all TypeScript.";

/**
 * Runs watch on all files. Runs gulp serve when changes occur.
  */
const watch = () => {
    return gulp.watch(['./src/**/*.*'], gulp.series(serve));
}
watch.description = 'Runs watch on all files. Runs gulp serve when changes occur.';

/**
 * Compresses all *.js files in the deployment folder.
 */
const zip = function() {
    return gulp.src('./deployment/package/**/*.*')
        .pipe(ziplib('icd2-bot.zip', { compress: true }))
        .pipe(gulp.dest('./deployment'));
}
zip.description = 'Compresses all *.js files in the deployment folder.';

function start(done) {
    return nodemon({
        script: './lib/index.js',
        ext: 'ts json js',
        tasks: ['build'],
        done: done
    });
}

const packageAzureFiles = [
    // Keep everything...
    '**/*.*',

    // ... but the following:
    '!node_modules/**/*.*',
    '!src/**/*.*',
    '!db/**/*.*',
    '!icd2-bot.bot',
    '!tsconfig.json',
    '!nodemon.json',
    '!gulpfile*.js',
    '!ICD296x96.png',
    '!./**/*.md',
    '!./**/*.ts',
    '!**/*.bot',
    '!*.env',
    '!package/**/*.*',
    '!web.config.old',
    '!webpack.config.js',
    '!tslint.json',
    '!./**/*.docx',
    '!./**/*.png',
    '!./**/*.map'
]

/**
 * Copies all *.js files into the ./deployment folder.
  */
const package = function() {
    return gulp.src(packageAzureFiles)
                .pipe(gulp.dest('./deployment/package'));

}
package.description = 'Copies all *.js files into the ./deployment folder.'

const build = gulp.series(clean, copy, docs, tsc, patch, package, zip);
build.description = 'Performs the entire build process.'

const serve = gulp.series(build, start);
serve.description = 'Runs the build, then starts the bot.'

module.exports = { copy, clean, build, docs, serve, patch, tsc, watch, zip, package }