# require-profiler

Simple tool to figure out the tree of `require()` calls and determine how time its taking to load.

## Features
* easy to use
* no dependencies

## Installation

Install via npm.

	npm install require-profiler

## Getting Started

To start profiling your `require()` calls:

```js
'use strict'

const requireProfiler = require( 'require-profiler' );

requireProfiler.capture();

// now require all your other modules that you want
// to profile

const otherModule = require( './lib/my-module' );

// disables profiling
requireProfiler.capture( false );
```

## Getting Profiler Data

After `capture( false )`, calling `get()` will provide a log of what was capture by the profiler.

```js
'use strict'

const requireProfiler = require( 'require-profiler' );

requireProfiler.capture();

// now require all your other modules that you want
// to profile

// disables profiling
requireProfiler.capture( false );

const profileData = requireProfiler.get();
```

The data is in the format:

```
{
	"includes": [

		// each root level module will have an object
	   {
	      "name": "/full/path/of/the/module",
	      "loadTime": <time to load>,
	      "childLoadTime": <time to load all of the children>,
	      "moduleTime": <time spent loading this module>,
	      "includes": [

	      		// child modules required by this module
	      ]
	   }
	]
}
```

## Indentifier

Once the profile data has been collected, the identifier can be used to filter out those modules that might be taking longer to load.

To filter out modules that are taking more than 20ms, we would use the identifier:

```js

// capture profile information here

const profileData = requireProfiler.get();

let filtered = requireProfiler.indentify( profileData )
	.filterLoadTime( 30 )
	.find();

// dump
console.log( JSON.stringify( filtered, null, 2 ) );      
```

For format from the identifier is exactly that of the profiler, except for the fact that some items will be eliminated from not meeting the criteria.


## License

The MIT License (MIT)

Copyright (c) 2016 vandium software, inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
