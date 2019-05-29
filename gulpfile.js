const gulp = require('gulp');
const  del  = require('del');
const exec = require('child_process').exec;

function clean() {
    return del('./lib');
}
clean.description = 'Deletes all compiled TypeScript files.';

function tsc() {
    return exec('tsc');
}
tsc.description = "Compiles all TypeScript."

function watch() {
    return gulp.watch(['./src/**/*.ts'], gulp.series(clean, tsc, serve));
}

function start(done) {
    return exec('node ./lib/index.js', (err, stdout, stderr) => {
        if(err) throw err;
        console.log(stdout);
        watch();
    });
}

const serve = gulp.series(clean, tsc, start);

const build = gulp.series(clean, tsc);


module.exports = { clean, build, serve, tsc }