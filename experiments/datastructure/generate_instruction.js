import fs from 'fs';

// Input data structure
const instructions = {
  ISA: "RV",
  funct3Mask: 0b00000000000000000111000000000000, // Common funct3 mask
  funct7Mask: 0b11111110000000000000000000000000, // Common funct7 mask
  instructions: [
    {
      name: "add",
      assembly: "rd, rs1, rs2",
      description: "Addition",
      type: "R",
      quadrant: 1,
      arch_width: 32,
      extension: "I",
      opcode: {
        value: 0b0110011,
        length: 7
      },
      funct3: {
        value: 0b000,
      },
      funct7: {
        value: 0b0000000,
      },
      fields: [
        {
          name: "rd",
          position: 7,
          length: 5
        },
        {
          name: "rs1",
          position: 15,
          length: 5
        },
        {
          name: "rs2",
          position: 20,
          length: 5
        }
      ]
    },
    {
      name: "sub",
      assembly: "rd, rs1, rs2",
      description: "Subtraction",
      type: "R",
      quadrant: 1,
      arch_width: 32,
      extension: "I",
      opcode: {
        value: 0b0110011,
        length: 7
      },
      funct3: {
        value: 0b000,
      },
      funct7: {
        value: 0b0000000,
      },
      fields: [
        {
          name: "rd",
          position: 7,
          length: 5
        },
        {
          name: "rs1",
          position: 15,
          length: 5
        },
        {
          name: "rs2",
          position: 20,
          length: 5
        }
      ]
    }

  ]
};

// Convert the data structure to JSON format
const jsonData = JSON.stringify(instructions, null, 2);

// Write the JSON data to a file
fs.writeFileSync('isa/riscv32/instructions.json', jsonData);

const parsedInstructions = JSON.parse(jsonData);

// Example: Extracting the funct3 field using the mask
const instruction = parsedInstructions.instructions[0];
// const funct3Mask = instruction.funct3.mask;
// const funct3Value = (instruction.opcode.value & funct3Mask) >>> funct3Mask.toString(2).length;

// console.log(`funct3 Value: ${funct3Value.toString(2)}`); // Output: funct3 Value: 0

// function