"use strict";

var $path = require("path");

var express = require("express");
var fse = require("fs-extra");
var spawn = require("cross-spawn");

var packageJson = require("./package.json");


var ceneLibs = [
    "cene"
];
var port = 8080;


var ownLib = packageJson.name;

if (!/^[a-z\-.]*$/.test(ownLib))
    throw new Error();


async function runCeneCli(args) {
    await new Promise((resolve, reject) => {
        spawn("npm", ["run", "cene", "--"].concat(args), {
            stdio: ["ignore", "inherit", "inherit"]
        })
            .on("close", code => {
                if (code !== 0)
                    return void reject(
                        new Error(`Cene exited with code ${code}`));
                
                resolve();
            });
    });
}

async function build(opt_options) {
    var options = Object.assign({
        minify: true
    }, opt_options);
    
    await fse.ensureDir("build/lib/");
    await fse.copy("src/", "build/src/");
    await fse.copy("lib-cene/", `build/lib/${ownLib}/`);
    for (const lib of ceneLibs) {
        await fse.copy(`node_modules/${lib}/lib-cene/`, `build/lib/${lib}/`);
    }
    
    var ceneCliArgs = "build.cene -i build/ -o dist/";
    if (options.minify)
        ceneCliArgs += " -m";
    await runCeneCli(ceneCliArgs.split(" "));
    
    await fse.ensureDir("dist/gh-pages/");
    await fse.copy("dist/demo/", "dist/gh-pages/demo/");
}

exports.clean = async () => {
    await fse.remove("build/");
    await fse.remove("dist/");
};

exports.build = async () => await build();

exports[ "build-debug" ] = async () => await build({ minify: false });

exports.serve = (cb) => {
    var app = express();
    app.use(express.static($path.resolve(__dirname, "dist/demo")));
    app.listen(port, () => {
        console.log(`Serving dist/demo/ at http://localhost:${port}/`);
    });
};
