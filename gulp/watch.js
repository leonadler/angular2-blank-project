const fs = require("fs");

module.exports = (gulp, g, config, paths, karmaServer, clearLastRun) => {

    gulp.task("watch", (done) => {
        const w = [];
        w[w.length] = gulp.watch(paths.srcApp("**/*.ts"), gulp.series("scripts"));
        // If we changnig *.html we must recompile corresponsding component.
        w[w.length] = gulp.watch(paths.srcApp("**/*.html")).on("change", path => {
            var tsfile = g.util.replaceExtension(path, ".ts");
            if (fs.existsSync(tsfile)) {
                var fd = fs.openSync(tsfile, "r+");
                fs.futimesSync(fd, new Date(), new Date());
                fs.closeSync(fd);
                // Do not need to run scripts, watcher triggers it by itself.
            } else {
                gulp.series(clearLastRun("scripts"), "scripts").call();
            }
        });
        w[w.length] = gulp.watch("src/index.html", gulp.series("htdocs"));
        w[w.length] = gulp.watch(["src/**/*.{scss,less,css}", "!src/**/_*.{scss,less}"], gulp.series("styles"));
        w[w.length] = gulp.watch("src/**/_*.{scss,less}", gulp.series(clearLastRun("styles"), "styles"));
        if (g.util.env.tests) {
            setTimeout(() => {
                karmaServer(config.karma, done);
            }, 5000);
        }
        process.on("SIGINT", () => {
            w.forEach(watcher => watcher.close());
            done();
        });
    });

};