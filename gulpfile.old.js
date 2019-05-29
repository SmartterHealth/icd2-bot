var gulp = require("gulp"),
    ts = require("gulp-typescript"),
    del = require("del"),
    exec = require('child_process').exec,
    zip = require("gulp-zip"),
    path = require('path'),
    sourcemaps = require('gulp-sourcemaps'),
    nodemon = require("gulp-nodemon");

function PathInfo() {
        this.glob = function(folder) {
        return path.join(folder, '**/*.*')
    }
    this.package = './package';
    this.packageAzure = path.join(this.package, 'azure');

    this.source = './src';
    this.sourceTypeScript = this.glob(this.source, '*.ts');
    this.output = './lib';
}

const paths = new PathInfo();

function glob(p, ext = '*.*'){
    return path.join(p, '**', ext)
}

const globs = {
    src: './src/**/*.*',
    build: './build/**/*.*',
    output: './lib/**/*.*',
    dist: './dist/**/*.*',
    distAz: './dist/azure'
}

gulp.task("compile", function () {

    var project = ts.createProject('tsconfig.json', {
        typescript: require('typescript'),
        declaration: true
    });

    return gulp.src(paths.sourceTypeScript)
        .pipe(sourcemaps.init())
        .pipe(project())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.output))
        
});

gulp.task("clean", function () {
    del([paths.output, paths.package]);
});

gulp.task("serve", ["compile"], function() {
    var stream = nodemon({
        script: "./lib/index.js",
        watch: "./src",
        tasks: ["compile"],
        env: { "DEBUG": "Application,Request,Response" }
    });
    return stream;
});

gulp.task("default", function() {
    
})

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
    '!gulpfile.js',
    '!ICD296x96.png',
    '!./**/*.md',
    '!./**/*.ts'
]

gulp.task('package-azure', ['clean', 'compile'], function() {
	gulp.src(packageAzureFiles, { compress: true })
		.pipe(zip('icd2-bot.zip', { compress: true }))
        .pipe(gulp.dest(paths.packageAzure));
});