

const instructions = {
    add: {
        name: "add",
        mnemonics: "add rd, rs1, rs2",
        fields: [
            { name: "opcode", bits: 0b0110011 },
            { name: "rd", bits: "5" },
            { name: "funct3", bits: 0b000 },
            { name: "rs1", bits: "5" },
            { name: "rs2", bits: "5" },
            { name: "funct7", bits: 0b0000000 }
        ],
        pseudocode: `
            rd = rs1 + rs2;
            `
    },
    sub: {
        name: "sub",
        mnemonics: "sub rd, rs1, rs2",
        fields: [
            { name: "opcode", bits: 0b0110011 },
            { name: "rd", bits: "5" },
            { name: "funct3", bits: 0b000 },
            { name: "rs1", bits: "5" },
            { name: "rs2", bits: "5" },
            { name: "funct7", bits: 0b0100000 }
        ],
        pseudocode: `
            rd = rs1 - rs2;
            `
    },
    xor: {
        name: "xor",
        mnemonics: "xor rd, rs1, rs2",
        fields: [
            { name: "opcode", bits: 0b0110011 },
            { name: "rd", bits: "5" },
            { name: "funct3", bits: 0b100 },
            { name: "rs1", bits: "5" },
            { name: "rs2", bits: "5" },
            { name: "funct7", bits: 0b0000000 }
        ],
        pseudocode: `
            rd = rs1 ^ rs2;
            `
    },
    slt: {
        name: "slt",
        mnemonics: "slt rd, rs1, rs2",
        fields: [
            { name: "opcode", bits: 0b0110011 },
            { name: "rd", bits: "5" },
            { name: "funct3", bits: 0b010 },
            { name: "rs1", bits: "5" },
            { name: "rs2", bits: "5" },
            { name: "funct7", bits: 0b0000000 }
        ],
        pseudocode: `
            rd = {   31'b0,    ( rs1[31] == rs2[31] )  ?  (rs1<rs2)  :  (rs1[31])   };
            `
    },
    or: {
        name: "or",
        mnemonics: "or rd, rs1, rs2",
        fields: [
            { name: "opcode", bits: 0b0110011 },
            { name: "rd", bits: "5" },
            { name: "funct3", bits: 0b110 },
            { name: "rs1", bits: "5" },
            { name: "rs2", bits: "5" },
            { name: "funct7", bits: 0b0000000 }
        ],
        pseudocode: `
            rd = rs1 | rs2;
            `
    },
    sll: {
        name: "sll",
        mnemonics: "sll rd, rs1, rs2",
        fields: [
            { name: "opcode", bits: 0b0110011 },
            { name: "rd", bits: "5" },
            { name: "funct3", bits: 0b001 },
            { name: "rs1", bits: "5" },
            { name: "rs2", bits: "5" },
            { name: "funct7", bits: 0b0000000 }
        ],
        pseudocode: `
            rd = rs1  <<	zero extends	rs2[4:0] ;
            `
    },
    srl: {
        name: "srl",
        mnemonics: "srl rd, rs1, rs2",
        fields: [
            { name: "opcode", bits: 0b0110011 },
            { name: "rd", bits: "5" },
            { name: "funct3", bits: 0b101 },
            { name: "rs1", bits: "5" },
            { name: "rs2", bits: "5" },
            { name: "funct7", bits: 0b0000000 }
        ],
        pseudocode: `
            rd = rs1	zero extends	>>	rs2[4:0] ;
            `
    },
    sra: {
        name: "sra",
        mnemonics: "sra rd, rs1, rs2",
        fields: [
            { name: "opcode", bits: 0b0110011 },
            { name: "rd", bits: "5" },
            { name: "funct3", bits: 0b101 },
            { name: "rs1", bits: "5" },
            { name: "rs2", bits: "5" },
            { name: "funct7", bits: 0b0100000 }
        ],
        pseudocode: `
            rd = rs1	msb extends	>>	rs2[4:0] ;
            `
    },
    sltu: {
        name: "sltu",
        mnemonics: "sltu rd, rs1, rs2",
        fields: [
            { name: "opcode", bits: 0b0110011 },
            { name: "rd", bits: "5" },
            { name: "funct3", bits: 0b011 },
            { name: "rs1", bits: "5" },
            { name: "rs2", bits: "5" },
            { name: "funct7", bits: 0b0000000 }
        ],
        pseudocode: `
            rd =  { 31'b0, rs1 < rs2 }	;
            `
    },
    and: {
        name: "and",
        mnemonics: "and rd, rs1, rs2",
        fields: [
            { name: "opcode", bits: 0b0110011 },
            { name: "rd", bits: "5" },
            { name: "funct3", bits: 0b111 },
            { name: "rs1", bits: "5" },
            { name: "rs2", bits: "5" },
            { name: "funct7", bits: 0b0000000 }
        ],
        pseudocode: `
            rd = rs1  &	rs2 ;
            `
    },

};


// Function to encode an instruction
function encodeInstruction({ instruction }) {
    const parts = instruction.split(" ");
    const opcode = instructions[parts[0]].fields.find(field => field.name === "opcode").bits;
    const rd = extractRegisterNumber({ register: parts[1] });
    const rs1 = extractRegisterNumber({ register: parts[2] });
    const rs2 = extractRegisterNumber({ register: parts[3] });

    let encodedInstruction = 0;
    encodedInstruction |= opcode << 0;
    encodedInstruction |= rd << 7;
    encodedInstruction |= rs1 << 15;
    encodedInstruction |= rs2 << 20;

    return encodedInstruction;
}

// Function to extract register number from a string like "x7"
function extractRegisterNumber({ register }) {
    return parseInt(register.substr(1));
}

// Function to decode a 32-bit value into an instruction
function decodeInstruction({ value }) {
    for (const instruction in instructions) {
        const fields = instructions[instruction].fields;
        const opcode = fields.find(field => field.name === "opcode").bits;
        const rd = (value >> 7) & 0b11111;
        const rs1 = (value >> 15) & 0b11111;
        const rs2 = (value >> 20) & 0b11111;

        if (opcode === (value & 0b1111111)) {
            return {
                instruction,
                decodedInstruction: {
                    rd,
                    rs1,
                    rs2
                }
            };
        }
    }

    return null;
}

// Example usage
const encoded = encodeInstruction({ instruction: "add rd, x7, x11" });
console.log("Encoded instruction:", encoded.toString(2));
console.log("Encoded instruction:", encoded);


const decoded = decodeInstruction({ value: encoded });
console.log("Decoded instruction:", decoded);


///////////////////////////////////////////////////


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
  