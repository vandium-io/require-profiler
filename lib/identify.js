'use strict';

function cloneItem( item ) {

    var copy = {};

    Object.keys( item ).forEach( function( key ) {

        if( key !== 'includes' ) {

            copy[ key ] = item[ key ];
        }
    });

    return copy;
}

class Identify {

    constructor( capture ) {

        this._capture = capture;

        this._minLoad = 0;
    }

    filterLoadTime( minLoad ) {

        this._minLoad = minLoad;

        return this;
    }

    find() {

        let self = this;

        let stack = [ { includes: [] } ];

        function process( includes ) {

            includes.forEach( function( item ) {

                let parent = stack[ stack.length-1 ];

                if( item.loadTime >= self._minLoad ) {

                    var copy = cloneItem( item );

                    parent.includes.push( copy );

                    if( item.includes ) {

                        copy.includes = [];

                        stack.push( copy );

                        process( item.includes );

                        stack.pop();

                        if( copy.includes.length === 0 ) {

                            delete copy.includes;
                        }
                    }
                }
            })
        }

        process( this._capture.includes );

        return stack[0];
    }
}

function identify( capture ) {

    return new Identify( capture );
}

module.exports = identify;
