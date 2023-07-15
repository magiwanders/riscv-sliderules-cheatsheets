import { instructions } from "./generate_instruction.js"
import { maskWidth } from "./encode_decode.js";

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


// Helper function to calculate shift of the fields
function calculateShift(mask) {
  const binaryString = mask.toString(2).padStart(32, '0');
  const shiftingValue = 31 - binaryString.lastIndexOf('1');

  return shiftingValue;
}

// Helper function to convert decimal value given to hex and 32 bit binary
function convertToBinaryAndHex({ value }) {
  const binary = `0b${(value >>> 0).toString(2).padStart(32, '0')}`;
  const hex = `0x${(value >>> 0).toString(16).padStart(8, '0').toUpperCase()}`;
  return { binary: binary, hex: hex };
}


// Filter the instructions according to constraints.
export function pruneInstructions({ constraints }) {

  const prunedInstructions = {};
  for (const instructionName in instructions) {
    const instruction = instructions[instructionName];
    if (matchesConstraints({ instruction: instruction, constraints: constraints })) {
      prunedInstructions[instructionName] = instruction;
    }
  }
  return prunedInstructions;
}

// Helpfer function to match constraints
function matchesConstraints({ instruction, constraints }) {
  const binaryString = getInstructionBinary({ instruction: instruction });
  for (let i = 0; i < constraints.length; i++) {
    const constraint = constraints[i];
    if (constraint !== '-' && constraint !== binaryString[i]) {
      return false;
    }
  }
  return true;
}


// Generater the 32 bit representation, registers are hardcoded to zero as of now
function getInstructionBinary({ instruction }) {

  const encodedFields = instruction.fields;
  let encodedInstruction = 0;

  for (const fieldName in encodedFields) {
    // Dealing with fields which has defined values in data structure
    if (encodedFields[fieldName].hasOwnProperty('value')) {
      encodedInstruction |= encodedFields[fieldName].value << calculateShift(encodedFields[fieldName].mask);
    }
    else {
      // Dealing with fields which has no defined values in data structure, fetching it from operands
      let zeros = "0".repeat(maskWidth({ mask: encodedFields[fieldName].mask }))
      encodedInstruction |= parseInt(`${zeros}`) << calculateShift(encodedFields[fieldName].mask);
    }
  }

  let binaryString = convertToBinaryAndHex({ value: encodedInstruction }).binary.slice(2);
  return binaryString
}

const constraints = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "1", "-", "0", "-", "-", "-", "-", "-", "0", "1", "1", "0", "0", "1", "1"];
const filtered = pruneInstructions({ instructions, constraints });

console.log(filtered);