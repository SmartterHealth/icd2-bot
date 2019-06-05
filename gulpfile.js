const gulp = require('gulp');
const del = require('del');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const nodemon = require('gulp-nodemon');
const ziplib = require('gulp-zip');

function copy() {
    return gulp.src(['./src/**/*.json'])
        .pipe(gulp.dest('./lib'));
}

function clean() {
    return del('./lib');
}
clean.description = 'Deletes all compiled TypeScript files.';

function docs() {
    // REQUIRES pandoc!!! https://pandoc.org/MANUAL.html
    return exec('pandoc -s README.docx -t markdown -o README.md')
}

function tsc() {
    return exec('tsc');
}
tsc.description = "Compiles all TypeScript."

const watch = (done) => {
    return gulp.watch(['./src/**/*.*'], gulp.series(serve));
}

function zip() {
    return gulp.src('./deployment/package/**/*.*')
    .pipe(ziplib( 'icd2-bot.zip', { compress: true }))
    .pipe(gulp.dest('./deployment'));
}

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
    '!./**/*.png'
]

function package(done) {
    return del('./deployment')
        .then((value) => {
            gulp.src(packageAzureFiles)
                .pipe(gulp.dest('./deployment/package'));
        });
}

const build = gulp.series(clean, copy, docs, tsc, zip, package);
const serve = gulp.series(build, start);

module.exports = { copy, clean, build, docs, serve, tsc, watch, zip, package }