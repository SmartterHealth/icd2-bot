var gulp = require("gulp"),
    ts = require("gulp-typescript"),
    del = require("del"),
    nodemon = require("gulp-nodemon");

const globs = {
    src: './src/**/*.*',
    build: './build/**/*.*',
    output: './lib/**/*.*'
}

gulp.task("compile", function () {
    var project = ts.createProject({
        "target": "ES6",
        "module": "commonjs",
        "moduleResolution": "node",
        "sourceMap": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "removeComments": true,
        "noImplicitAny": false
    });
    return gulp.src("./src/**/*.ts")
        .pipe(project())
        .pipe(gulp.dest("./lib/"))
});

gulp.task("clean", function () {
    del([globs.output]);
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