// Import and call from here the functions that generate the API .json files in the public/api folder
import fs from 'fs';
import { instructions}  from './instructions.mjs';
import { registerFiles } from './register-files.mjs';
import { immediates } from './immediates.mjs';

console.log("Generating of API .json files...")

fs.writeFileSync(
    'public/isa/instructions.json', 
    JSON.stringify(instructions, null, 2)
)

fs.writeFileSync(
    'public/isa/register-files.json', 
    JSON.stringify(registerFiles, null, 2)
)

fs.writeFileSync(
    'public/isa/immediates.json', 
    JSON.stringify(immediates, null, 2)
)