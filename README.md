# Mise-en.cene

[![Travis build](https://travis-ci.org/rocketnia/mise-en.cene.svg?branch=main)](https://travis-ci.org/rocketnia/mise-en.cene)

The Mise-en.cene (MEEZ-ah-SEEN) project is meant to make it easy to take a screenplay-like dialogue between characters and have it compiled to multiple display styles for high accessibility. In particular, it's intended to let conversations be displayed in a visual novel style with character art and background images, but with fallbacks to comic or screenplay formats when those are more accessible to the reader.

Mise-en.cene will put to the test some experimental ideas about how to replace CSS (and HTML) while meeting CSS's goals of decoration, customization, and accessibility. The results could be generally applicable to other document types and presentation media.

However, Mise-en.cene accomplishes barely any of this yet. Right now it takes a simple screenplay syntax and compiles it to JavaScript code that generates an HTML list to show the dialogue.

The demo in this repo builds to a [page you can see in your browser](https://rocketnia.github.io/mise-en.cene/demo/).


## Using Mise-en.cene in your project

Mise-en.cene is based on the Cene programming language, which isn't even very stable itself yet. Cene packages are distributed as Node.js packages using the `npm` command-line utility. Create your own Node.js project with a package.json and a Gulp and Cene build setup as seen in [the Cene example project](https://github.com/era-platform/cene-scaffold), and then follow the below steps to incorporate Mise-en.cene into the project:

Install the specific version of Cene that Mise-en.cene has been tested with:

```
npm install --save cene@0.0.37
```

Install Mise-en.cene itself:

```
npm install --save mise-en.cene
```

Ensure `"cene"` and `"mise-en.cene"` appear in your gulpfile.js's `ceneLibs` array exactly once, like so:

```
var ceneLibs = [
    "cene",
    "mise-en.cene"
];
```

Ensure each of these lines is in your build.cene file exactly once:

```
(import lib cene \;qq[chops.cene])
(import lib \;qq[mise-en.cene] \;qq[mise-en.cene])
```

Now you can use the utilities Mise-en.cene provides as part of your Cene code. (TODO: Document those utilities.)


## Maintaining Mise-en.cene

First, check out this repo.

Install its development dependendencies:

```
npm install
```

To run a build:

```
npm run build
```

This creates intermediate files in a new build/ directory and generates demo files in a new dist/ directory. The Cene source code for the demos is obtained from the src/ directory. By editing the src/ directory, you can maintain the demos, and by editing the lib-cene/ directory, you can maintain the library itself.

Alternatively, to run a build without minifying the resulting JavaScript files:

```
npm run build-debug
```

To delete the build/ and dist/ directories:

```
npm run clean
```

To run the static file server on port 8080:

```
npm run gulp serve
```

To run a build and run the static file server on port 8080, concurrently:

```
npm run gulp build serve
```


## About this project

This project is released under the MIT license. See LICENSE.txt.
