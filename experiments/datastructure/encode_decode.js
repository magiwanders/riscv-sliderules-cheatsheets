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
  const binary = `0b${value.toString(2).padStart(32, '0')}`;
  const hex = `0x${value.toString(16).padStart(8, '0').toUpperCase()}`;
  return { binary, hex };
}


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


function decodeInstruction({ value }) {
  let mnemonic = null;
  let operands = null;

  for (const instructionName in instructions) {
    const instruction = instructions[instructionName];
    const opcode = instruction.fields.opcode.value.toString(2);
    const funct3 = instruction.fields.funct3.value.toString(2);
    const funct7 = instruction.fields.funct7.value.toString(2);

    if (
      (value & instruction.fields.opcode.mask) === parseInt(opcode, 2) &&
      (value & instruction.fields.funct3.mask) === parseInt(funct3, 2) &&
      (value & instruction.fields.funct7.mask) === parseInt(funct7, 2)
    ) {
      mnemonic = instructionName;
      operands = {
        rd: `x${(value & instruction.fields.rd.mask) >>> 7}`,
        rs1: `x${(value & instruction.fields.rs1.mask) >>> 15}`,
        rs2: `x${(value & instruction.fields.rs2.mask) >>> 20}`
      };
      break;
    }
  }

  return { mnemonic, operands };
}




// Example usage
const inputInstruction = 'add x1, x2, x3';
const encodedInstruction = encodeInstruction({ instruction: inputInstruction });
console.log('Encoded Instruction in 32 bit binary:', encodedInstruction.binary);
console.log('Encoded Instruction in hexadecimal:', encodedInstruction.hex);


const decodedInstruction = decodeInstruction({ value: encodedInstruction });
console.log('Decoded Instruction:', decodedInstruction);