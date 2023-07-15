// import fs from 'fs';
// import path from 'path';
import { instructions } from './instructions.mjs';
// const currentDir = path.dirname(new URL(import.meta.url).pathname);
// const instructionsFilePath = path.join(currentDir, 'instructions.json');
// const instructionsData = fs.readFileSync(instructionsFilePath, 'utf-8');

// Helper function to extract the register number from register name
function extractRegisterNumber({ register }) {
  return parseInt(register.slice(1));
}


// Helper function to convert decimal value given to hex and 32 bit binary
function convertToBinaryAndHex({ value }) {
  const binary = `0b${(value >>> 0).toString(2).padStart(32, '0')}`;
  const hex = `0x${(value >>> 0).toString(16).padStart(8, '0').toUpperCase()}`;
  return { binary: binary, hex: hex };
}


// Helper function to convert decimal to binary
function decimalToBinary({ decimal, numBits = 32 }) {
  // Handle negative numbers
  if (decimal < 0) {
    decimal = (2 ** numBits) + decimal;
  }
  const binary = decimal.toString(2).padStart(numBits, '0');
  return binary;
}


// Helper function to extract the bit values using given mask
function extractValues({ binaryvalue, binaryMask }) {
  let result = 0;
  let shiftCount = 0;
  const valueLength = binaryMask.toString(2).split('').filter((bit) => bit === '1').length;

  for (let i = 0; i < 32; i++) {
    const maskBit = (binaryMask >> i) & 1;
    if (maskBit === 1) {
      const valueBit = (binaryvalue >> i) & 1;
      result |= valueBit << shiftCount;
      shiftCount++;
    }
  }

  return parseInt(decimalToBinary({ decimal: result, numBits: valueLength }), 2);
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


// Generater the 32 bit representation
function getInstructionBinary({ instruction }) {

  const encodedFields = instruction.fields;
  let encodedInstruction = 0;

  for (const fieldName in encodedFields) {
    // Dealing with fields which has defined values in data structure
    if (encodedFields[fieldName].hasOwnProperty('value')) {
      encodedInstruction |= encodedFields[fieldName].value << calculateShift({ mask: encodedFields[fieldName].mask });
    }
    else {
      // Dealing with fields which has no defined values in data structure, fetching it from operands
      let zeros = "0".repeat(maskWidth({ mask: encodedFields[fieldName].mask }))
      encodedInstruction |= parseInt(`${zeros}`) << calculateShift({ mask: encodedFields[fieldName].mask });
    }
  }

  let binaryString = convertToBinaryAndHex({ value: encodedInstruction }).binary.slice(2);
  return binaryString
}


// Helper function to calculate shift of the fields
function calculateShift({ mask }) {
  const binaryString = mask.toString(2).padStart(32, '0');
  const shiftingValue = 31 - binaryString.lastIndexOf('1');

  return shiftingValue;
}


// Function to encode a given instruction
export function encodeInstruction({ mnemonic, operands }) {
  const instruction = instructions[mnemonic];
  const encodedFields = instruction.fields;
  let encodedInstruction = 0;

  for (const fieldName in encodedFields) {
    // Dealing with fields which has defined values in data structure
    if (encodedFields[fieldName].hasOwnProperty('value')) {
      encodedInstruction |= encodedFields[fieldName].value << calculateShift({ mask: encodedFields[fieldName].mask });
    }
    else {
      // Dealing with fields which has no defined values in data structure, fetching it from operands
      encodedInstruction |= extractRegisterNumber({ register: operands[fieldName] }) << calculateShift({ mask: encodedFields[fieldName].mask });
    }
  }
  return convertToBinaryAndHex({ value: encodedInstruction });
}


// Function to decode a given assembly value
export function decodeInstruction({ value }) {
  let mnemonic = null;
  let operands = null;

  for (const instructionName in instructions) {
    const instruction = instructions[instructionName];
    let match = true;

    for (const fieldName in instruction.fields) {
      const field = instruction.fields[fieldName];
      const expectedValue = extractValues({ binaryvalue: value, binaryMask: field.mask });
      if (field.hasOwnProperty('value')) {
        const fieldValue = field.value;
        if (expectedValue !== fieldValue) {
          match = false;
          break;
        }
      } else {
        const registerNumber = extractValues({ binaryvalue: value, binaryMask: field.mask });
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


// Makes the pruned instruction into a data structure most similar to a sliderules row
export function tabulateInstructionEncode({ prunedInstruction: { } }) {
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
  const valueLength = mask.toString(2).split('').filter((bit) => bit === '1').length;
  return valueLength
}

// Input: a mask in binary form. Output: position of the most significant bit of the mask.
export function maskPosition({ mask = 0b0 }) {
  return mask === 0 ? -1 : Math.floor(Math.log2(mask));
}
