const fs = require('fs');
let code = fs.readFileSync('src/lib/questionGenerators.ts', 'utf8');

// Replace duplicate properties
code = code.replace(/interactiveStyle:\s*'balloons',\s*interactiveStyle:\s*'balloons'/g, "interactiveStyle: 'balloons'");
code = code.replace(/interactiveStyle:\s*'balloons',\s*interactiveStyle:\s*'balloons'\s*as\s*const/g, "interactiveStyle: 'balloons'");
code = code.replace(/type:\s*'choice',\s*interactiveStyle:\s*'balloons',\s*type:\s*'choice'/g, "type: 'choice',\n      interactiveStyle: 'balloons'");

fs.writeFileSync('src/lib/questionGenerators.ts', code);
console.log('Fixed linting errors');
