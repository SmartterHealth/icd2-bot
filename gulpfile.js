const { gulp, series, task} = require('gulp');
const  del  = require('del');
const exec = require('child_process').exec;

function clean() {
    return del('./lib');
}
clean.description = 'Deletes all compiled TypeScript files.';

function tsc() {
    return exec('tsc');
}

exports.clean = clean;
exports.build = series([clean, tsc]);
