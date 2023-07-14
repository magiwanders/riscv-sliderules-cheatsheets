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
  console.log(valueLength)
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
    //Dealing with fields which has defined values in data structure
    if (encodedFields[fieldName].hasOwnProperty('value')) {
      encodedInstruction |= encodedFields[fieldName].value << calculateShift(encodedFields[fieldName].mask);
    }
    else {
      //     //Dealing with fields which has no defined values in data structure, fetching it from operands
      encodedInstruction |= extractRegisterNumber({ register: operands[fieldName] }) << calculateShift(encodedFields[fieldName].mask);
    }
  }

  return convertToBinaryAndHex({ value: encodedInstruction });
}




// Function to decode a given assembly value
function decodeInstruction({ value }) {
  // TODO: Make it dynamic, need to fetch the fields using the opcode and describe it likewise.
  let mnemonic = null;
  let operands = null;

  for (const instructionName in instructions) {
    const instruction = instructions[instructionName];
    const opcode = parseInt(decimalToBinary({ decimal: instruction.fields.opcode.value, numBits: 7 }), 2);
    const funct3 = parseInt(decimalToBinary({ decimal: instruction.fields.funct3.value, numBits: 3 }), 2);
    const funct7 = parseInt(decimalToBinary({ decimal: instruction.fields.funct7.value, numBits: 7 }), 2);

    if (
      extractValues({ binaryvalue: value, binaryMask: instruction.fields.opcode.mask }) === opcode &&
      extractValues({ binaryvalue: value, binaryMask: instruction.fields.funct3.mask }) === funct3 &&
      extractValues({ binaryvalue: value, binaryMask: instruction.fields.funct7.mask }) === funct7

    ) {
      console.log(instructionName)
      mnemonic = instructionName;
      operands = {
        rd: `x${extractValues({ binaryvalue: value, binaryMask: instruction.fields.rd.mask })}`,
        rs1: `x${extractValues({ binaryvalue: value, binaryMask: instruction.fields.rs1.mask })}`,
        rs2: `x${extractValues({ binaryvalue: value, binaryMask: instruction.fields.rs2.mask })}`
      };
      break;
    }
  }

  return { mnemonic, operands };
};



// Example usage
const instructionValue = '0b00000000111110100000010100110011'; // Need to use '0b' representation
const decodedInstruction = decodeInstruction({ value: instructionValue });
console.log(decodedInstruction);

// Example usage
const encodedInstruction = encodeInstruction({ mnemonic: "add", operands: { rd: 'x10', rs1: 'x20', rs2: 'x15' } });
console.log(encodedInstruction);
