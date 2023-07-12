import { instructions } from "./generate_instruction.js"

// function filter({ instructions = {}, constraints = {} }) {
//     let instructionSubset = { ...instructions };

//     // Check if constraints contain RV size (32 or 64)
//     if (constraints.rvSize) {
//         const rvSize = constraints.rvSize;

//         instructionSubset = Object.keys(instructionSubset).reduce((subset, mnemonic) => {
//             if (instructionSubset[mnemonic].arch_width === rvSize) {
//                 subset[mnemonic] = instructionSubset[mnemonic];
//             }
//             return subset;
//         }, {});
//     }

//     if (constraints.extensions) {
//         const extensions = constraints.extensions;

//         // Filter instructions based on extensions
//         instructionSubset = Object.keys(instructionSubset).reduce((subset, mnemonic) => {
//             if (extensions.includes(instructionSubset[mnemonic].extension)) {
//                 subset[mnemonic] = instructionSubset[mnemonic];
//             }
//             return subset;
//         }, {});
//     }

//     // Check if constraints contain G instruction
//     if (constraints.g) {
//         delete instructionSubset.G;
//     }

//     return instructionSubset;
// }


// const constraints = {
//     rvSize: 32,
//     extensions: ["I"],
//     g: false,
//     value: 0b00000000000000000000000010110011
// };

// const subset = filter({ instructions, constraints });
// console.log(subset);

// //TODO: Filtering upon bit values


function decimalToBinary({ decimal, numBits = 32 }) {
  // Handle negative numbers
  if (decimal < 0) {
    decimal = (2 ** numBits) + decimal;
  }
  const binary = decimal.toString(2).padStart(numBits, '0');
  return binary;
}

function filter({ instructions = {}, constraints = [] }) {
  const filteredInstructions = [];

  for (const instructionName in instructions) {
    const instruction = instructions[instructionName];
    if (matchesConstraints(instruction, constraints)) {
      filteredInstructions.push(instruction);
    }
  }
  return filteredInstructions;
}

function matchesConstraints(instruction, constraints) {
  const binaryString = getInstructionBinary(instruction);
  for (let i = 0; i < constraints.length; i++) {
    const constraint = constraints[i];
    if (constraint !== '-' && constraint !== binaryString[i]) {
      return false;
    }
  }
  return true;
}

function getInstructionBinary(instruction) {

  const opcode = decimalToBinary({ decimal: instruction.fields.opcode.value, numBits: 7 });
  const funct3 = decimalToBinary({ decimal: instruction.fields.funct3.value, numBits: 3 });
  const funct7 = decimalToBinary({ decimal: instruction.fields.funct7.value, numBits: 7 });


  let binaryString = `${funct7}${"00000"}${"00000"}${funct3}${"00000"}${opcode}`;
  return binaryString
}


const constraints = ["-", "0", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "0", "1", "1", "0", "0", "1", "1"];
const filtered = filter({ instructions, constraints });

console.log(filtered);