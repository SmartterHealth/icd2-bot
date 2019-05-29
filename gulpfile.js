const gulp = require('gulp');
const  del  = require('del');
const { exec, spawn } = require('child_process');

function clean() {
    return del('./lib');
}
clean.description = 'Deletes all compiled TypeScript files.';

function tsc() {
    return exec('tsc');
}
tsc.description = "Compiles all TypeScript."

const watch = (done) => {
    gulp.watch(['./src/**/*.*'], gulp.series(clean, tsc, serve));
    done();
}

function start(done) {
    let ls = spawn('node',['./lib/index.js'], { cwd: __dirname });
    ls.stdout.on('data', function(data) {
        console.log(data.toString());
    });

    ls.stderr.on('data', function(data) {
        console.log(data.toString());
    });

    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());
    });
}

const build = gulp.series(clean, tsc);
const serve = gulp.series(build, start);

module.exports = { clean, build, serve, tsc, watch }