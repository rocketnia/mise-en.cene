var $path = require( "path" );

var del = require( "del" );
var express = require( "express" );
var gulp = require( "gulp" );
var _ = require( "lodash" );
var spawn = require( "cross-spawn" );
var when = require( "when" );

var packageJson = require( "./package.json" );


var ceneLibs = [
    "cene",
    "mise-en.cene"
];
var port = 8080;


var ownLib = packageJson.name;

if ( !/^[a-z\-.]*$/.test( ownLib ) )
    throw new Error();


function build( opt_options ) {
    var options = _.defaults( {}, opt_options, {
        minify: true
    } );
    
    var npmCommand = "run cene -- build.cene -i build/ -o dist/";
    if ( options.minify )
        npmCommand += " -m";
    
    return when.all( [
        gulp.src( "src/**/*" ).pipe( gulp.dest( "build/src" ) ),
        gulp.src( "lib-cene/**/*" ).pipe(
            gulp.dest( "build/lib/" + ownLib ) )
    ].concat(
        ceneLibs.map( function ( lib ) {
            return gulp.src(
                "node_modules/" + lib + "/lib-cene/**/*"
            ).pipe( gulp.dest( "build/lib/" + lib ) );
        } )
    ) ).then( function ( ignored ) {
        return when.promise( function ( resolve, reject ) {
            spawn( "npm", npmCommand.split( " " ), {
                stdio: [ "ignore", "inherit", "inherit" ]
            } ).on( "close", function ( code ) {
                if ( code !== 0 )
                    return void reject(
                        new Error(
                            "Cene exited with code " + code ) );
                
                resolve(
                    gulp.src( "dist/demo/**/*" ).pipe(
                        gulp.dest( "dist/gh-pages/demo" ) ) );
            } );
        } );
    } );
}

gulp.task( "clean", function () {
    return del( [ "build", "dist" ] );
} );

gulp.task( "build", function () {
    return build();
} );

gulp.task( "build-debug", function () {
    return build( {
        minify: false
    } );
} );

gulp.task( "serve", function ( then ) {
    var app = express();
    app.use(
        express.static( $path.resolve( __dirname, "dist/demo" ) ) );
    app.listen( port, function () {
        console.log(
            "Serving dist/demo/ at http://localhost:" + port + "/" );
    } );
} );
