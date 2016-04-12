'use strict';

const indentify = require( './identify' );

const profiler = require( './require-profiler' );

module.exports = {

    capture: profiler.capture,

    reset: profiler.reset,

    get: profiler.get,

    indentify: indentify
};
