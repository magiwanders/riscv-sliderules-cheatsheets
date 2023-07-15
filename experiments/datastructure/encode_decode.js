import fs from 'fs';
import path from 'path';

const currentDir = path.dirname(new URL(import.meta.url).pathname);
const instructionsFilePath = path.join(currentDir, 'isa/riscv32/instructions.json');
const instructionsData = fs.readFileSync(instructionsFilePath, 'utf-8');
const instructions = JSON.parse(instructionsData);


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


// Input: a mask in binary form. Output: number of ones in the mask (its width).
export function maskWidth({ mask = 0b0 }) {
  const valueLength = mask.toString(2).split('').filter((bit) => bit === '1').length;
  return valueLength
}

function calculateShift(mask) {
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
      encodedInstruction |= encodedFields[fieldName].value << calculateShift(encodedFields[fieldName].mask);
    }
    else {
      // Dealing with fields which has no defined values in data structure, fetching it from operands
      encodedInstruction |= extractRegisterNumber({ register: operands[fieldName] }) << calculateShift(encodedFields[fieldName].mask);
    }
  }

  return convertToBinaryAndHex({ value: encodedInstruction });
}


// Function to decode a given assembly value
function decodeInstruction({ value }) {
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



// // Example usage
// const encodedInstruction = encodeInstruction({ mnemonic: "and", operands: { rd: 'x11', rs1: 'x31', rs2: 'x20' } });
// console.log(encodedInstruction);

// // Example usage
// const instructionValue = encodedInstruction.binary; // Need to use '0b' representation
// const decodedInstruction = decodeInstruction({ value: instructionValue });
// console.log(decodedInstruction);