'use strict';

const Module = require('module');

const originalRequire = Module.prototype.require;

var captureStack = [ { includes: [] } ];

function requireCapture( path ){

    var filename = Module._resolveFilename( path, this );

    var parentRequireInfo = captureStack[ captureStack.length - 1 ];

    var requireInfo = {

        name: filename,
        loadTime: 0,
        includes: []
    };

    parentRequireInfo.includes.push( requireInfo );

    captureStack.push( requireInfo );

    let startTime = Date.now();

    let contents = originalRequire.call( this, path );

    let endTime = Date.now();

    requireInfo.loadTime = (endTime - startTime);

    if( requireInfo.includes.length === 0 ) {

        delete requireInfo.includes;
    }

    if( requireInfo.loadTime === 0 ) {

        // remove from parent if load time isn't significant
        parentRequireInfo.includes.pop();
    }

    captureStack.pop();

    return contents;
}

function capture( enable ) {

    if( enable === undefined ) {

        enable = true;
    }

    if( enable ) {

        // reset capture stack
        reset();

        Module.prototype.require = requireCapture;
    }
    else {

        Module.prototype.require = originalRequire;
    }
}

function reset() {

    captureStack = [ { includes: [] } ];
}

function updateTimes( captureObject ) {

    if( captureObject.includes && !captureObject.childLoadTime ) {

        let childTime = 0;

        captureObject.includes.forEach( function( child ) {

            updateTimes( child );

            childTime+= child.loadTime;
        });

        captureObject.childLoadTime = childTime;

        if( captureObject.loadTime ) {

            captureObject.moduleTime = Math.max( captureObject.loadTime - childTime, 0 );
        }
        else {

            captureObject.loadTime = childTime;
            captureObject.moduleTime = 0;
        }
    }
}

function get() {

    let root = captureStack[0];

    updateTimes( root );

    return root;
}


module.exports = {

    capture,

    reset,

    get: get,
};
