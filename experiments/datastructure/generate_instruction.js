import fs from 'fs';

// Input data structure
export const instructions = {
  add: {
    ISA: "RV",
    assembly: "rd, rs1, rs2",
    description: "Addition",
    type: "R",
    arch_width: 32,
    extension: "I",
    fields: {
      opcode: { value: 0b0110011, mask: 0b1111111 },
      funct3: { value: 0b000, mask: 0b111 << 12 },
      funct7: { value: 0b0000000, mask: 0b1111111 << 25 },
      rs1: { mask: 0b11111 << 15 },
      rs2: { mask: 0b11111 << 20 },
      rd: { mask: 0b11111 << 7 }
    }
  },
  sub: {
    ISA: "RV",
    assembly: "rd, rs1, rs2",
    description: "Subtraction",
    type: "R",
    arch_width: 32,
    extension: "I",
    fields: {
      opcode: { value: 0b0110011, mask: 0b1111111 },
      funct3: { value: 0b000, mask: 0b111 << 12 },
      funct7: { value: 0b0100000, mask: 0b1111111 << 25 },
      rs1: { mask: 0b11111 << 15 },
      rs2: { mask: 0b11111 << 20 },
      rd: { mask: 0b11111 << 7 }
    }
  },
  xor: {
    ISA: "RV",
    assembly: "rd, rs1, rs2",
    description: "Bitwise XOR",
    type: "R",
    arch_width: 32,
    extension: "I",
    fields: {
      opcode: { value: 0b0110011, mask: 0b1111111 },
      funct3: { value: 0b100, mask: 0b111 << 12 },
      funct7: { value: 0b0000000, mask: 0b1111111 << 25 },
      rs1: { mask: 0b11111 << 15 },
      rs2: { mask: 0b11111 << 20 },
      rd: { mask: 0b11111 << 7 }
    }
  },
  slt: {
    ISA: "RV",
    assembly: "rd, rs1, rs2",
    description: "Set Less Than",
    type: "R",
    arch_width: 32,
    extension: "I",
    fields: {
      opcode: { value: 0b0110011, mask: 0b1111111 },
      funct3: { value: 0b010, mask: 0b111 << 12 },
      funct7: { value: 0b0000000, mask: 0b1111111 << 25 },
      rs1: { mask: 0b11111 << 15 },
      rs2: { mask: 0b11111 << 20 },
      rd: { mask: 0b11111 << 7 }
    }
  },
  or: {
    ISA: "RV",
    assembly: "rd, rs1, rs2",
    description: "Bitwise OR",
    type: "R",
    arch_width: 32,
    extension: "I",
    fields: {
      opcode: { value: 0b0110011, mask: 0b1111111 },
      funct3: { value: 0b110, mask: 0b111 << 12 },
      funct7: { value: 0b0000000, mask: 0b1111111 << 25 },
      rs1: { mask: 0b11111 << 15 },
      rs2: { mask: 0b11111 << 20 },
      rd: { mask: 0b11111 << 7 }
    }
  },
  sll: {
    ISA: "RV",
    assembly: "rd, rs1, rs2",
    description: "Shift Left Logical",
    type: "R",
    arch_width: 32,
    extension: "I",
    fields: {
      opcode: { value: 0b0110011, mask: 0b1111111 },
      funct3: { value: 0b001, mask: 0b111 << 12 },
      funct7: { value: 0b0000000, mask: 0b1111111 << 25 },
      rs1: { mask: 0b11111 << 15 },
      rs2: { mask: 0b11111 << 20 },
      rd: { mask: 0b11111 << 7 }
    }
  },
  srl: {
    ISA: "RV",
    assembly: "rd, rs1, rs2",
    description: "Shift Right Logical",
    type: "R",
    arch_width: 32,
    extension: "I",
    fields: {
      opcode: { value: 0b0110011, mask: 0b1111111 },
      funct3: { value: 0b101, mask: 0b111 << 12 },
      funct7: { value: 0b0000000, mask: 0b1111111 << 25 },
      rs1: { mask: 0b11111 << 15 },
      rs2: { mask: 0b11111 << 20 },
      rd: { mask: 0b11111 << 7 }
    }
  },
  sra: {
    ISA: "RV",
    assembly: "rd, rs1, rs2",
    description: "Shift Right Arithmetic",
    type: "R",
    arch_width: 32,
    extension: "I",
    fields: {
      opcode: { value: 0b0110011, mask: 0b1111111 },
      funct3: { value: 0b101, mask: 0b111 << 12 },
      funct7: { value: 0b0100000, mask: 0b1111111 << 25 },
      rs1: { mask: 0b11111 << 15 },
      rs2: { mask: 0b11111 << 20 },
      rd: { mask: 0b11111 << 7 }
    }
  },
  sltu: {
    ISA: "RV",
    assembly: "rd, rs1, rs2",
    description: "Set Less Than Unsigned",
    type: "R",
    arch_width: 32,
    extension: "I",
    fields: {
      opcode: { value: 0b0110011, mask: 0b1111111 },
      funct3: { value: 0b011, mask: 0b111 << 12 },
      funct7: { value: 0b0000000, mask: 0b1111111 << 25 },
      rs1: { mask: 0b11111 << 15 },
      rs2: { mask: 0b11111 << 20 },
      rd: { mask: 0b11111 << 7 }
    }
  },
  and: {
    ISA: "RV",
    assembly: "rd, rs1, rs2",
    description: "Bitwise AND",
    type: "R",
    arch_width: 32,
    extension: "I",
    fields: {
      opcode: { value: 0b0110011, mask: 0b1111111 },
      funct3: { value: 0b111, mask: 0b111 << 12 },
      funct7: { value: 0b0000000, mask: 0b1111111 << 25 },
      rs1: { mask: 0b11111 << 15 },
      rs2: { mask: 0b11111 << 20 },
      rd: { mask: 0b11111 << 7 }
    }
  }
};


// Convert the data structure to JSON format
const jsonData = JSON.stringify(instructions, null, 2);

// Write the JSON data to a file
fs.writeFileSync('isa/riscv32/instructions.json', jsonData);

