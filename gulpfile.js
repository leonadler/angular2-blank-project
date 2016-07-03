"use strict";

const gulp = require("gulp");
const g = require("gulp-load-plugins")();
const lastRun = require("last-run");
const karma = require("karma");
const saveStream = require("save-stream");
const _ = require("lodash");
const config = require("./env.conf");
const args = g.util.env;

require("gulp-di")(gulp, {scope: []})
    .tasks("gulp")
    .provide("g", g)
    .provide("config", config)
    .provide("paths", config.paths)
    .provide("debug", debug)
    .provide("karmaServer", karmaServer)
    .provide("clearLastRun", clearLastRun)
    .provide("typingsStream", _.once(() => gulp.src(config.typings).pipe(saveStream())))
    .resolve();

function debug(title, namespace) {
    var arg = args.debug;
    var debugStream = g.debug({title: title});
    if (arg === true || arg === "*") {
        return debugStream;
    } else if (typeof arg === "string") {
        title = title.toLowerCase();
        arg = arg.toLowerCase();
        if (title.indexOf(arg) !== -1 || (namespace && namespace.indexOf(arg) !== -1)) {
            return debugStream;
        }
    }
    return g.util.noop();
}

function karmaServer(options, done) {
    const server = new karma.Server(options, (code) => {
        done(code ? new Error("Karma error code " + code) : null);
    });
    server.start();
    return server;
}

function clearLastRun(name) {
    var task = gulp._getTask(name);
    return function reset(done) {
        lastRun.release(task);
        done();
    };
}

// gulp.task('build2', () =>
//   gulp.src('build/js/main.js')
//     .pipe(g.bro({
//         bundleExternal: false
//     }))
//     .pipe(gulp.dest('build/js2'))
// );

// gulp.task('build3', () =>
//     g.file("vendors.js", `
//         require('@angular/core');
//         `, {src: true})
//     .pipe(g.bro({
//     }))
//     .pipe(gulp.dest('build/js2'))
// )

gulp.task("build", gulp.series(
    "clean",
    gulp.parallel("scripts", "styles", "assets"),
    "htdocs",
    "symlinks"
));

gulp.task("test", gulp.series(
    "build",
    "karma",
    "coverage"
));

gulp.task("serve", gulp.series(
    "build",
    gulp.parallel("watch", "livereload")
));
