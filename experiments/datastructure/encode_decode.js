import fs from 'fs';

// Read the JSON data from the file
const jsonData = JSON.parse(fs.readFileSync('isa/riscv32/instructions.json', 'utf8'));

// Encode an instruction based on the provided data structure
function encodeInstruction({ instruction }) {
  const { instructions, funct3Mask, funct7Mask } = jsonData;
  const [opcode, funct3, funct7] = instruction.split(' ')[0].split('.');
  const operands = instruction.split(' ')[1].split(',');

  for (const instr of instructions) {
    if (instr.name === opcode) {
      const encodedInstruction = instr.opcode.value |
        (instr.funct3.value << instr.funct3.position) |
        (instr.funct7.value << instr.funct7.position);

      for (const field of instr.fields) {
        const operand = operands.find(op => op.trim() === field.name);
        if (operand) {
          const reg = operand.trim().replace('x', '');
          encodedInstruction |= reg << field.position;
        }
      }

      return encodedInstruction;
    }
  }

  return null; // Instruction not found
}

// Decode an instruction based on the provided data structure
function decodeInstruction({ value }) {
  const { instructions, funct3Mask, funct7Mask } = jsonData;

  for (const instr of instructions) {
    const opcodeValue = (value & instr.opcode.length) >>> instr.opcode.position;
    if (opcodeValue === instr.opcode.value) {
      const funct3Value = (value & funct3Mask) >>> instr.funct3.position;
      const funct7Value = (value & funct7Mask) >>> instr.funct7.position;
      const fields = [];

      for (const field of instr.fields) {
        const fieldValue = (value & (field.length << field.position)) >>> field.position;
        fields.push({ [field.name]: fieldValue });
      }

      return {
        instruction: instr.name,
        opcode: opcodeValue,
        funct3: funct3Value,
        funct7: funct7Value,
        fields
      };
    }
  }

  return null; // Instruction not found
}
