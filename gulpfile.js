var gulp = require( "gulp" );
var when = require( "when" );

var spawn = require( "cross-spawn" );
var del = require( "del" );

var packageJson = require( "./package.json" );


var ownLib = packageJson.name;

if ( !/^[a-z\-.]*$/.test( ownLib ) )
    throw new Error();

var ceneLibs = [
    "cene",
    "mise-en.cene"
];

gulp.task( "clean", function () {
    return del( [ "build", "fin" ] );
} );

gulp.task( "build", function () {
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
            spawn( "npm",
                "run cene -- build.cene -i build/ -o fin/ -m".split(
                    " " ),
            {
                stdio: [ "ignore", "inherit", "inherit" ]
            } ).on( "close", function ( code ) {
                if ( code !== 0 )
                    return void reject(
                        new Error(
                            "Cene exited with code " + code ) );
                
                resolve( null );
            } );
        } );
    } );
} );
