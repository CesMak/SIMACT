
# SIMACT #
SIMACT (Simulative Adaptive Control Theory) is an advanced library for control theory. This library can do symbolic calculations and contains many basic functions like calculating the observability or controllability matrix.

## Usage ##
Just include the **simact.bundle.js** file in your website! 

## Documentation ##

## Changes on SIMACT ##

If I should do some changes please open a new Issue.

If you want to install the simact library on your pc do the following:

1. Copy algebrite.js and simact.js into a simact-lib folder

2. `npm install big-integer` also `npm install browserify`

3. `browserify simact.js --standalone simact > simact.bundle.js`

4. Testing:`npm install jasmine`
	* Go in the spec folder and create a test.spec.js file
	* Enter a simple test in that file: ```var simact  = require("../simact"); describe("hello world",function(){ it("result should be ...",function(){ //console.log(sim.add(0.2)); expect(simact.addPP(0.2)).toBe(0.2); });});```
 	* Go to main folder and test with `jasmine`

5. Documentation: 
 	 * `npm install jsdoc`
 	 * `./node_modules/.bin/jsdoc simact.js`


7. If you want to change the Algebrite.js file:
 	* Git clone algebrite
 	* in Eclipse: create new project
 	* into that project import (from File System) and slect the downloaded folder
 	* eg.: go to runtime -> symbol.coffee and change outputs!


## Dependency ##
The SIMACT Library depends on:
* [Algebrite](www.algebrite.org) which depends on: [BigInteger](https://github.com/peterolson/BigInteger.js/tree/master)
* [Numeric js](www.numericjs.com)

## License ##
Copyright 2017: Markus Lamprecht, Contact: MarkusLamprecht@live.de
If you want to use this library please make sure you also respect the licenses of the Algebrite, Numeric js and BigInteger library (see under Dependency). 

