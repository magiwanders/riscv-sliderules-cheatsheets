// import fs from 'fs';
// import path from 'path';
import { instructions } from './instructions.mjs';
// const currentDir = path.dirname(new URL(import.meta.url).pathname);
// const instructionsFilePath = path.join(currentDir, 'instructions.json');
// const instructionsData = fs.readFileSync(instructionsFilePath, 'utf-8');

// Helper function to extract the register number from register name
function _extractRegisterNumber({ register = "x0" }) {
  return parseInt(register.slice(1));
}


// Helper function to convert decimal value given to hex and 32 bit binary
// function _convertToBinaryAndHex({ value = 0 }) {
//   const binary = `0b${(value >>> 0).toString(2).padStart(32, '0')}`;
//   const hex = `0x${(value >>> 0).toString(16).padStart(8, '0').toUpperCase()}`;
//   return { binary: binary, hex: hex };
// }


// // Helper function to convert decimal to binary
// function _decimalToBinary({ decimal = 0, numBits = 32 }) {
//   // Handle negative numbers
//   if (decimal < 0) {
//     decimal = (2 ** numBits) + decimal;
//   }
//   const binary = decimal.toString(2).padStart(numBits, '0');
//   return binary;
// }


// Helper function to convert decimal value given to hex and binary strings
function _binaryHexString({ value = 0 }) {
  const binary = `0b${(value >>> 0).toString(2).padStart(32, '0')}`;
  const hex = `0x${(value >>> 0).toString(16).padStart(8, '0').toUpperCase()}`;
  return { binary: binary, hex: hex };
}


// Helper function to extract the bit values using given mask
function _extractValues({ binaryvalue = 0b0, binaryMask = 0b0 }) {
  let result = 0;
  let shiftCount = 0;

  for (let i = 0; i < 32; i++) {
    const maskBit = (binaryMask >> i) & 1;
    if (maskBit === 1) {
      const valueBit = (binaryvalue >> i) & 1;
      result |= valueBit << shiftCount;
      shiftCount++;
    }
  }
  return result
}


// Helpfer function to match constraints
function _matchesConstraints({ instruction = {}, constraints = {} }) {
  const binaryString = _getInstructionBinary({ instruction: instruction });
  for (let i = 0; i < constraints.length; i++) {
    const constraint = constraints[i];
    if (constraint !== '-' && constraint !== binaryString[i]) {
      return false;
    }
  }
  return true;
}


// Generater the 32 bit representation
function _getInstructionBinary({ instruction = {} }) {

  const encodedFields = instruction.fields;
  let encodedInstruction = 0;

  for (const fieldName in encodedFields) {
    // Dealing with fields which has defined values in data structure
    if (encodedFields[fieldName].hasOwnProperty('value')) {
      encodedInstruction |= encodedFields[fieldName].value << _calculateShift({ mask: encodedFields[fieldName].mask });
    }
    else {
      // Dealing with fields which has no defined values in data structure, fetching it from operands
      // let zeros = "0".repeat(maskWidth({ mask: encodedFields[fieldName].mask }))
      let zeros = 0b0;
      encodedInstruction |= zeros << _calculateShift({ mask: encodedFields[fieldName].mask });
    }
  }

  let binaryString = _binaryHexString({ value: encodedInstruction }).binary.slice(2);
  return binaryString
}


// Helper function to calculate shift of the fields
function _calculateShift({ mask = 0b0 }) {
  const binaryString = mask.toString(2).padStart(32, '0');
  const shiftingValue = 31 - binaryString.lastIndexOf('1');
  return shiftingValue;
}


// Function to encode a given instruction
export function encodeInstruction({ mnemonic = "mnemonic", operands = {} }) {
  const instruction = instructions[mnemonic];
  const encodedFields = instruction.fields;
  let encodedInstruction = 0;

  for (const fieldName in encodedFields) {
    // Dealing with fields which has defined values in data structure
    if (encodedFields[fieldName].hasOwnProperty('value')) {
      encodedInstruction |= encodedFields[fieldName].value << _calculateShift({ mask: encodedFields[fieldName].mask });
    }
    else {
      // Dealing with fields which has no defined values in data structure, fetching it from operands
      encodedInstruction |= _extractRegisterNumber({ register: operands[fieldName] }) << _calculateShift({ mask: encodedFields[fieldName].mask });
    }
  }
  return _binaryHexString({ value: encodedInstruction });
}


// Function to decode a given assembly value
export function decodeInstruction({ value = 0b0 }) {
  let mnemonic = null;
  let operands = null;
  for (const instructionName in instructions) {
    const instruction = instructions[instructionName];
    let match = true;

    for (const fieldName in instruction.fields) {
      const field = instruction.fields[fieldName];
      const expectedValue = _extractValues({ binaryvalue: value, binaryMask: field.mask });
      if (field.hasOwnProperty('value')) {
        const fieldValue = field.value;
        if (expectedValue !== fieldValue) {
          match = false;
          break;
        }
      } else {
        const registerNumber = _extractValues({ binaryvalue: value, binaryMask: field.mask });
        const registerName = `x${registerNumber}`;
        operands = operands || {};
        operands[fieldName] = registerName;
      }
    }

    if (match) {
      mnemonic = instructionName;
      break;
    }
  }
  return { mnemonic, operands };
};


// Filter the instructions according to constraints.
export function pruneInstructions({ constraints = {} }) {
  const prunedInstructions = {};

  for (const instructionName in instructions) {
    const instruction = instructions[instructionName];
    if (_matchesConstraints({ instruction: instruction, constraints: constraints })) {
      prunedInstructions[instructionName] = instruction;
    }
  }
  return prunedInstructions;
}


// Makes the pruned instruction into a data structure most similar to a sliderules row
export function tabulateInstructionEncode({ prunedInstruction = {} }) {

  const tabulatedInstructions = [];

  for (const instructionName in prunedInstruction) {
    const instruction = prunedInstruction[instructionName];
    const row = [];

    row.push({ content: instruction.extension, width: 1 });
    row.push({ content: instruction.type, width: 1 });
    row.push({ content: instruction.description, width: 1 });
    row.push({ content: instruction.pseudocode, width: 1 });

    row.push({ content: instructionName, width: 1 });

    const operands = instruction.assembly.join(", ")
    row.push({ content: operands, width: 1 });

    let fieldNames = [];
    for (const fieldName in instruction.fields) {
      const field = instruction.fields[fieldName];
      const position = maskPosition({ mask: field.mask });
      fieldNames.push([fieldName, position])
    }
    fieldNames.sort((a, b) => b[1] - a[1]);
    fieldNames = fieldNames.map(([fieldName]) => fieldName);
    for (const fieldName of fieldNames) {
      const field = instruction.fields[fieldName];
      const width = maskWidth({ mask: field.mask });
      const rowItem = { content: fieldName, width: width };
      if (field.hasOwnProperty('value')) {
        rowItem.value = field.value;
      }
      row.push(rowItem);
    }

    tabulatedInstructions.push(row);
  }

  return tabulatedInstructions;

  /*
  Example of tabulation:
  
  input:    
  
  add: {
    ISA: "RV",
    assembly: ["rd", "rs1", "rs2"],
    pseudocode: 'rd = rs1 + rs2',
    description: "Addition",
    type: "R",
    arch_width: [32, 64],
    extension: "I",
    fields: {
      opcode: { value: 0b0110011, mask: 0b1111111 },
      funct3: { value: 0b000, mask: 0b111 << 12 },
      funct7: { value: 0b0000000, mask: 0b1111111 << 25 },
      rs1: { mask: 0b11111 << 15 },
      rs2: { mask: 0b11111 << 20 },
      rd: { mask: 0b11111 << 7 }
    }
  }

  output:

  [
      {
          content: 'I',
          width: 1,
      },
      {
          content: 'R',
          width: 1,
      },
      {
          content: 'Addition',
          width: 1,
      },
      ...
      {
          content: 'funct7',
          width: 7,
          value: 0b0000000
      },
      {
          content: 'rs2',
          width: 5,
      },
      {
          content: 'rs1',
          width: 5,
      },
      ...
      {
          content: 'rd = rs1 + rs2'
          width: 1,
      },
      ...
  ]
  */
}

// Input: a mask in binary form. Output: number of ones in the mask (its width).
export function maskWidth({ mask = 0b0 }) {
  mask = mask >>> 0 // this line is to convert the number to unsigned
  const valueLength = mask.toString(2).split('').filter((bit) => bit === '1').length;
  return valueLength
}

// Input: a mask in binary form. Output: position of the most significant bit of the mask.
export function maskPosition({ mask = 0b0 }) {
  mask = mask >>> 0 // this line is to convert the number to unsigned
  if (mask === 0) {
    return -1; // Edge case: If the mask is 0, there is no significant bit
  }
  const maskInStr = mask.toString(2).padStart(32)
  return 31 - maskInStr.search('1');
}


// Example usage
const encodedInstruction = encodeInstruction({ mnemonic: "sub", operands: { rd: 'x11', rs1: 'x31', rs2: 'x20' } });
console.log(encodedInstruction);

// Example usage
const instructionValue = encodedInstruction.binary; // Need to use '0b' representation
const decodedInstruction = decodeInstruction({ value: 0b01000001010011111000010110110011 });
console.log(decodedInstruction);

const constraints = ["-", "1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "0", "1", "1", "0", "0", "1", "1"];
const filtered = pruneInstructions({ instructions, constraints });

console.log(filtered);