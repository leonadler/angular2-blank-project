(function (global) {
    var paths = {
        "n:*": "node_modules/*"
    };
    // map tells the System loader where to look for things
    var map = {
        "@angular": "n:@angular",
        "lodash": "n:lodash",
        "power-assert": "n:power-assert",
        // angular bundles
        '@angular/core': 'n:@angular/core/bundles/core.umd.js',
        '@angular/common': 'n:@angular/common/bundles/common.umd.js',
        '@angular/compiler': 'n:@angular/compiler/bundles/compiler.umd.js',
        '@angular/platform-browser': 'n:@angular/platform-browser/bundles/platform-browser.umd.js',
        '@angular/platform-browser-dynamic': 'n:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
        '@angular/http': 'n:@angular/http/bundles/http.umd.js',
        '@angular/router': 'n:@angular/router/bundles/router.umd.js',
        '@angular/forms': 'n:@angular/forms/bundles/forms.umd.js',
        // angular testing umd bundles
        '@angular/core/testing': 'n:@angular/core/bundles/core-testing.umd.js',
        '@angular/common/testing': 'n:@angular/common/bundles/common-testing.umd.js',
        '@angular/compiler/testing': 'n:@angular/compiler/bundles/compiler-testing.umd.js',
        '@angular/platform-browser/testing': 'n:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
        '@angular/platform-browser-dynamic/testing': 'n:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
        '@angular/http/testing': 'n:@angular/http/bundles/http-testing.umd.js',
        '@angular/router/testing': 'n:@angular/router/bundles/router-testing.umd.js',
        '@angular/forms/testing': 'n:@angular/forms/bundles/forms-testing.umd.js',
    };

    var meta = {
        // "js/*" : { defaultExtension:  "js" },
        // "n:*" : { defaultExtension:  "js" }
    };

    var packageConfigPaths = [];

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        "js": { defaultExtension: "js" },
        "n:": { defaultExtension: "js" },
        "power-assert": { main: "build/power-assert.js"},
    };

    // packageConfigPaths.push('node_modules/*/package.json');

    var config = {
        // defaultJSExtensions: true,
        paths: paths,
        map: map,
        packages: packages,
        meta: meta,
        // packageConfigPaths: packageConfigPaths
    };

    // filterSystemConfig - index.html's chance to modify config before we register it.
    if (global.filterSystemConfig) {
        global.filterSystemConfig(config);
    }

    System.config(config);

})(this);
