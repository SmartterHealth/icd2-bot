var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var del = require("del");
var exec = require('child_process').exec;

gulp.task("build", ["tsc", "copy"], function() {

});

gulp.task("clean", () => {
    del(["./messages", "./.funcpack"]);
});

gulp.task("copy", function () {
    return gulp.src("./src/*.json")
        .pipe(gulp.dest("messages"));
});

gulp.task("tsc", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("messages"));
});

gulp.task("pack", function() {
    exec("funcpack pack ./");
});

gulp.task("serve", ["build"], function() {
    exec("node messages/index.js")
})

