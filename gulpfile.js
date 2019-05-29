const gulp = require('gulp');
const  del  = require('del');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const nodemon = require('gulp-nodemon');

function clean() {
    return del('./lib');
}
clean.description = 'Deletes all compiled TypeScript files.';

function tsc() {
    return exec('tsc');
}
tsc.description = "Compiles all TypeScript."

const watch = (done) => {
    return gulp.watch(['./src/**/*.*'], gulp.series(serve));
}

function start(done) {
    return nodemon({
        script: './lib/index.js',
        ext: 'ts json js',
        tasks: ['build'],
        done: done
    });
}

const build = gulp.series(clean, tsc);
const serve = gulp.series(build, start);

module.exports = { clean, build, serve, tsc, watch }