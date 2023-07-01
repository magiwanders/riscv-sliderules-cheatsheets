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
  return { binary, hex };
}

// Helper function to convert decimal to binary
function decimalToBinary({ decimal, numBits = 32 }) {
  // Handle negative numbers
  if (decimal < 0) {
    decimal = (2 ** numBits) + decimal;
  }

  const binary = decimal.toString(2).padStart(numBits, '0');
  return `0b${binary}`;
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
  return decimalToBinary({ decimal: result, numBits: valueLength });
}


// Function to encode a given instruction
function encodeInstruction({ instruction }) {
  const parts = instruction.split(" ");
  const opcode = instructions[parts[0]].fields.opcode.value.toString(2);
  const funct3 = instructions[parts[0]].fields.funct3.value.toString(2);
  const funct7 = instructions[parts[0]].fields.funct7.value.toString(2);
  const rd = extractRegisterNumber({ register: parts[1] });
  const rs1 = extractRegisterNumber({ register: parts[2] });
  const rs2 = extractRegisterNumber({ register: parts[3] });

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
function decodeInstruction({ value }) {
  // TODO: Make it dynamic, like we need to fetch the fields using the opcode and describe it likewise.
  // const binaryValue = value.slice(2); // Remove the '0b' prefix from the binary string
  let mnemonic = null;
  let operands = null;
  let opcodeValue = null
  console.log(value)

  for (const instructionName in instructions) {
    const instruction = instructions[instructionName];
    //const opcode = decimalToBinary({ decimal: (value & instruction.fields.opcode.mask) >>> 0, numBits: instruction.fields.opcode.mask.toString(2).length });

    const opcode = decimalToBinary({ decimal: instruction.fields.opcode.value, numBits: 7 });
    const funct3 = decimalToBinary({ decimal: instruction.fields.funct3.value, numBits: 3 });
    const funct7 = decimalToBinary({ decimal: instruction.fields.funct7.value, numBits: 7 });
    //console.log(extractValues({ binaryvalue: value, binaryMask: instruction.fields.funct7.mask }))
    //console.log(extractValues({ binaryvalue: value, binaryMask: instruction.fields.funct7.mask }) == funct7)
    if (
      extractValues({ binaryvalue: value, binaryMask: instruction.fields.opcode.mask }) === opcode &&
      extractValues({ binaryvalue: value, binaryMask: instruction.fields.funct3.mask }) === funct3
      //extractValues({ binaryvalue: value, binaryMask: instruction.fields.funct7.mask }) === funct7

    ) {
      console.log(instructionName)
      mnemonic = instructionName;
      // operands = {
      //   rd: `x${extractRegisterNumber(instruction.fields.rd.mask)}`,
      //   rs1: `x${extractRegisterNumber(instruction.fields.rs1.mask)}`,
      //   rs2: `x${extractRegisterNumber(instruction.fields.rs2.mask)}`
      // };
      break;
    }
  }

  return { mnemonic, operands };
};



// Example usage
const inputInstruction = 'or x1, x2, x3';
const encodedInstruction = encodeInstruction({ instruction: inputInstruction });
console.log('Encoded Instruction in 32 bit binary:', encodedInstruction.binary);
console.log('Encoded Instruction in hexadecimal:', encodedInstruction.hex);



// Example usage
const instructionValue = encodedInstruction.binary;
const decodedInstruction = decodeInstruction({ value: instructionValue });
console.log(decodedInstruction);
