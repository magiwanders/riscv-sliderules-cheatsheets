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


// Function to encode a given instruction
export function encodeInstruction({ mnemonic, operands }) {

  const opcode = instructions[mnemonic].fields.opcode.value.toString(2);
  const funct3 = instructions[mnemonic].fields.funct3.value.toString(2);
  const funct7 = instructions[mnemonic].fields.funct7.value.toString(2);
  const rd = extractRegisterNumber({ register: operands.rd });
  const rs1 = extractRegisterNumber({ register: operands.rs1 });
  const rs2 = extractRegisterNumber({ register: operands.rs2 });

  let encodedInstruction = 0;
  encodedInstruction |= parseInt(opcode, 2) << 0;
  encodedInstruction |= rd << 7;
  encodedInstruction |= parseInt(funct3, 2) << 12;
  encodedInstruction |= rs1 << 15;
  encodedInstruction |= rs2 << 20;
  encodedInstruction |= parseInt(funct7, 2) << 25;
  console.log({ encodedInstruction })

  return convertToBinaryAndHex({ value: encodedInstruction });
}


// Function to decode a given assembly value
export function decodeInstruction({ value }) {
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
  if (mnemonic === null) {
    return {mnemonic:"Not a valid instruction as of now, we will add more soon!", operands: null}
  }
  return { mnemonic, operands };
};


// Example usage
// const encodedInstruction = encodeInstruction({ mnemonic:  "add", operands: {rd: "x2", rs1:"x7", rs2:"x10"} });
// console.log(encodedInstruction);

// const instructionValue = encodedInstruction.binary; // Need to use '0b' representation
// const decodedInstruction = decodeInstruction({ value: 0b00000000101000111000000100110011 });
// console.log(decodedInstruction);



// Filter the instructions according to constraints.
export function pruneInstructions({ constraints: { } }) {
  // assume the data structure is in scope
  let pruneInstructions = {}
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

}

// Input: a mask in binary form. Output: position of the most significant bit of the mask.
export function maskPosition({ mask = 0b0 }) {

}
