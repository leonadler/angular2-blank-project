"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || "8080";

const path = require("path");
const unixify = require("unixify");
const pkgDir = require("pkg-dir");
const _ = require("lodash");
const g = require("gulp-load-plugins")();
const args = g.util.env;
const projectRoot = pkgDir.sync();

const baseLibs = [
    new Lib("amdainty", {shim: true}),
    new Lib("es6-shim", {polyfill: true, dev: true}),
    new Lib("zone.js", {polyfill: true, dev: true}),
    new Lib("reflect-metadata", {polyfill: true, dev: true}),
    new Lib("systemjs/dist/system.js", {dev: true}),
    new Lib("./systemjs.config.js", {dev: true}),
    new Lib("rxjs", {vendor: true}),
    new Lib("@angular/common", {vendor: true}),
    new Lib("@angular/compiler", {vendor: true}),
    new Lib("@angular/core", {vendor: true}),
    new Lib("@angular/http", {vendor: true}),
    new Lib("@angular/router", {vendor: true}),
    new Lib("@angular/platform-browser", {vendor: true}),
    new Lib("@angular/platform-browser-dynamic", {vendor: true}),
];

var tsProject = _.once(() => {
    var options = {
        typescript: require("typescript"),
        isolatedModules: Boolean(config.isDev && (args.isolatedModules || args.im))
    };
    if (config.isProd) {
        Object.assign(options, {
            outFile: "main.js",
            module: "amd"
        });
    }
    return g.typescript.createProject("tsconfig.json", options);
});

const config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    APP_BASE: "/",
    // Concat to single file, if false release build will be splitted to app.js and vendors.js
    get singleFile() {
        return false;
    },
    get isDev() {
        return !this.isProd;
    },
    get isProd() {
        return this.NODE_ENV === "production" || args.production === true;
    },
    get jsLibs() {
        var result = [];
        if (this.isDev) {
            result = baseLibs.filter(x => x.dev).map(x => x.main);
        } else if (this.isProd) {
            result = baseLibs.filter(x => x.prod).map(x => x.main);
        }
        return result;
    },
    paths: {
        srcApp: createGlob("src/app"),
        dest: "build",
        destJs: "build/js"
    },
    typings: [
        "typings/browser.d.ts",
        "node_modules/typescript/lib/lib.es6.d.ts"
    ],
    projectRoot: projectRoot,
    get tsProject() {
        return tsProject();
    },
    tscOptions: require("./tsconfig").compilerOptions,
    karma: {
        configFile: projectRoot + "/karma.conf.js"
    },
    get polyfills() {
        return baseLibs.filter(x => x.polyfill);
    },
    get vendors() {
        var result = baseLibs.filter(x => x.vendor);
        return result;
    },
    get shims() {
        return baseLibs.filter(x => x.shim);
    }
};

module.exports = config;

// ==========================
// Functions
// ==========================

function lib(path) {
    path = require.resolve(path).slice(projectRoot.length + 1);
    return unixify(path);
}

function createGlob(pattern) {
    var func = function() {
        var params = Array.prototype.slice.call(arguments);
        var args = [].concat(pattern, params);
        var result = path.join.apply(null, args);
        return unixify(result);
    };
    func.not = function() {
        var result = func.apply(null, arguments);
        return "!" + result;
    };
    return func;
}

function Lib(name, visibility) {
    this.name = name;
    if (!visibility) visibility = {};
    this.defaultVisibility = Boolean(visibility.default);
    Object.defineProperty(this, "main", {
        get: function() {
            return lib(this.name);
        }
    });
    ["shim", "polyfill", "dev", "prod", "test", "vendor"].forEach(name => {
        Object.defineProperty(this, name, {
            get: function() {
                var result = this.defaultVisibility;
                if (visibility[name] !== undefined) {
                    result = Boolean(visibility[name]);
                }
                return result;
            }
        });
    });
}