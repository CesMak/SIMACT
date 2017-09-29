1. Copy algebrite.js and simact.js into simact-lib folder

2. npm install big-integer

3. browserify simact.js --standalone simact > simact.bundle.js



4. Testing:
(install jasmine before in main folder)
jasmine init -> creates spec folder

go to spec folder
create test.spec.js file and fill it with:
var simact  = require("../simact");

describe("hello world",function(){


it("result should be ...",function(){
//console.log(sim.add(0.2));
expect(simact.addPP(0.2)).toBe(0.2);
});


});

Go to main folder and test wit jasmine

5. Documentation:npm install jsdoc

6. ./node_modules/.bin/jsdoc simact.js


7. If you want to change the Algebrite.js file:

-> Git clone algebrite
-> in Eclipse: create new project
-> into that project import (from File System) and slect the downloaded folder

8. Changing algebrite js:
go to runtime -> symbol.coffee and change outputs!