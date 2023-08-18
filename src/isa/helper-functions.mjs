import { instructions } from "./instructions.mjs";
import { immediates } from "./immediates.mjs";

// Helper function to extract the register number from register name
function _extractRegisterNumber({ register = "x0" }) {
  return parseInt(register.slice(1));
}

// Helper to transform the form {mnemonic: .. , operands: {...} } into plain assembly string 'add x1 x2 x2'
function _assembleInstruction({ mnemonic = "mnemonic", operands = {} }) {
  const assemblyOrder = instructions[mnemonic].assembly;
  const operandValues = assemblyOrder.map((field) => operands[field]).join(" ");
  return `${mnemonic} ${operandValues}`;
}

// Helper to transform the plain assembly string 'add x1 x2 x2' into the form {mnemonic: .. , operands: {...} }
function _parseAssemblyInstruction({
  assemblyString = "mnemonic op1 op2 op3",
}) {
  const [mnemonic, ...operandValues] = assemblyString.split(" ");
  const assemblyOrder = instructions[mnemonic].assembly;
  const instructionType = instructions[mnemonic].type;
  var operands = {};
  if (instructionType == "I" || instructionType == "R") {
    assemblyOrder.forEach((field, index) => {
      operands[field] = operandValues[index];
    });
  } else if (instructionType == "S") {
    operands = {
      rs1: operandValues[0],
      rs2: operandValues[1].split("(")[1].replace(/[()]/g, ""),
      imm: operandValues[1].split("(")[0],
    };
  }
  return { mnemonic, operands, instructionType };
}

// Helper function to convert decimal value given to hex and binary strings
function _binaryHexString({ value = 0 }) {
  const binary = `0b${(value >>> 0).toString(2).padStart(32, "0")}`;
  const hex = `0x${(value >>> 0).toString(16).padStart(8, "0").toUpperCase()}`;
  return { binary: binary, hex: hex };
}

// Helper function to extract the bit values using given mask
function _extractValues({ binaryvalue = 0b0, binaryMask = 0b0 }) {
  let result = 0;
  let shiftCount = 0;

  for (let i = 0; i < 32; i++) {
    const maskBit = (binaryMask >> i) & 1;
    if (maskBit === 1) {
      const valueBit = (binaryvalue >> i) & 1;
      result |= valueBit << shiftCount;
      shiftCount++;
    }
  }
  return result;
}

function _matchesConstraints({ instruction = {}, constraints = [] }) {
  const binaryArray = _getInstructionBinary({ instruction: instruction });

  for (let i = 0; i < binaryArray.length; i++) {
    const constraint = constraints[i];

    if (
      constraint !== "-" &&
      binaryArray[i] !== "n" &&
      constraint !== binaryArray[i]
    ) {
      return false;
    }
  }
  return true;
}

function _getInstructionBinary({ instruction = {} }) {
  const encodedFields = instruction.fields;
  const binaryArray = new Array(32).fill("n");

  for (const fieldName in encodedFields) {
    // Dealing with fields which has defined values in data structure
    if (encodedFields[fieldName].hasOwnProperty("value")) {
      const shift = _calculateShift({ mask: encodedFields[fieldName].mask });
      const value = encodedFields[fieldName].value
        .toString(2)
        .padStart(maskWidth({ mask: encodedFields[fieldName].mask }), "0");

      // Update the binaryArray with the bits from the value
      for (let i = 0; i < value.length; i++) {
        binaryArray[31 - (shift + i)] = value[value.length - 1 - i]; // Reversed order
      }
    } else {
      // Dealing with fields which has no defined values in data structure
      const shift = _calculateShift({ mask: encodedFields[fieldName].mask });
      const width = maskWidth({ mask: encodedFields[fieldName].mask });

      // Set "n" for the corresponding range in binaryArray
      for (let i = 0; i < width; i++) {
        binaryArray[31 - (shift + i)] = "n"; // Reversed order
      }
    }
  }
  return binaryArray;
}

// Helper function to calculate shift of the fields
function _calculateShift({ mask = 0b0 }) {
  const binaryString = mask.toString(2).padStart(32, "0");
  const shiftingValue = 31 - binaryString.lastIndexOf("1");
  return shiftingValue;
}

//Generate immediate value
function _encodeImmediate({ instructionType = "I", operands = {} }) {
  const immediateData = immediates[instructionType];
  let encodedImmediate = 0b0;

  if (instructionType === "I") {
    const imm = operands.imm;
    for (const [mask, valueMask] of Object.entries(immediateData)) {
      let value = 0b0;
      let maskBits = _binaryHexString({ value: mask }).binary;
      let valueBits = _binaryHexString({ value: valueMask }).binary;
      // Checking if mask and valueMask has same number of bits, otherwise expand/ compress according to the MSB
      if (
        maskBits.toString(2).replace(/0/g, "").length ===
        valueBits.toString(2).replace(/0/g, "").length
      ) {
        value = imm & valueBits;
        encodedImmediate |= value << (_calculateShift({ mask: maskBits }) + 2);
      } else {
        var bitPos = _calculateShift({ mask: valueBits }) + 2;
        var bitValue = (_binaryHexString({ value: imm }).binary >> bitPos) & 1;
        encodedImmediate |=
          bitValue << (_calculateShift({ mask: maskBits }) + 2);
      }
    }
    return encodedImmediate;
  } else if (instructionType === "S") {
    const imm = operands.imm;
    for (const [mask, valueMask] of Object.entries(immediateData)) {
      let value = 0b0;
      let maskBits = _binaryHexString({ value: mask }).binary;
      let valueBits = _binaryHexString({ value: valueMask }).binary;
      // Checking if mask and valueMask has same number of bits, otherwise expand/ compress according to the MSB
      if (
        maskBits.toString(2).replace(/0/g, "").length ===
        valueBits.toString(2).replace(/0/g, "").length
      ) {
        value = imm & valueBits;
        encodedImmediate |= value << (_calculateShift({ mask: maskBits }) + 2);
        console.log(_binaryHexString({value: value}).binary)
        console.log(_binaryHexString({value: encodedImmediate}).binary)
        console.log(_calculateShift({ mask: maskBits }) + 2)
      } else {
        var bitPos = _calculateShift({ mask: valueBits }) + 2;
        var bitValue = (_binaryHexString({ value: imm }).binary >> bitPos) & 1;
        encodedImmediate |=
          bitValue << (_calculateShift({ mask: maskBits }) + 2);
      }
    }
    console.log(_binaryHexString({value:encodedImmediate}).binary)
    return encodedImmediate;
  } else if (
    //instructionType === "S" ||
    instructionType === "B" ||
    instructionType === "U" ||
    instructionType === "J"
  ) {
    for (const mask in immediateData) {
      const value = immediateData[mask];
      if (operands.imm === value) {
        encodedImmediate |=
          (mask & immediateData[mask].value_mask) >> _calculateShift({ mask });
        break;
      }
    }
  }
  return encodedImmediate;
}

function _decodeImmediate({}) {
  return null;
}

// Function to encode a given instruction
export function encodeInstruction({ assemblyString = "mnemonic op1 op2 op3" }) {
  const { mnemonic, operands, instructionType } = _parseAssemblyInstruction({
    assemblyString: assemblyString,
  });
  const instruction = instructions[mnemonic];
  const encodedFields = instruction.fields;
  let encodedInstruction = 0;
  for (const fieldName in encodedFields) {
    // Dealing with fields which has defined values in data structure
    if (encodedFields[fieldName].hasOwnProperty("value")) {
      encodedInstruction |=
        encodedFields[fieldName].value <<
        _calculateShift({ mask: encodedFields[fieldName].mask });
    } else {
      if (["rd", "rs1", "rs2", "rs3"].includes(fieldName)) {
        // Dealing with fields which has no defined values in data structure, fetching it from operands
        encodedInstruction |=
          _extractRegisterNumber({ register: operands[fieldName] }) <<
          _calculateShift({ mask: encodedFields[fieldName].mask });
      }
    }
  }
  if (["I", "S", "B", "U", "J"].includes(instructionType)) {
    let immediateBits = 0b0;
    immediateBits = _encodeImmediate({
      instructionType: instructionType,
      operands: operands,
    });

    encodedInstruction |= immediateBits;
  }
  return _binaryHexString({ value: encodedInstruction });
}

// Function to decode a given assembly value
export function decodeInstruction({ value = 0b0 }) {
  let mnemonic = null;
  let operands = null;
  for (const instructionName in instructions) {
    const instruction = instructions[instructionName];
    let match = true;

    for (const fieldName in instruction.fields) {
      const field = instruction.fields[fieldName];
      const expectedValue = _extractValues({
        binaryvalue: value,
        binaryMask: field.mask,
      });
      if (field.hasOwnProperty("value")) {
        const fieldValue = field.value;
        if (expectedValue !== fieldValue) {
          match = false;
          break;
        }
      } else {
        const registerNumber = _extractValues({
          binaryvalue: value,
          binaryMask: field.mask,
        });
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
  return _assembleInstruction({ mnemonic: mnemonic, operands: operands });
}

// Filter the instructions according to constraints.
export function pruneInstructions({ constraints = {} }) {
  const prunedInstructions = {};

  for (const instructionName in instructions) {
    const instruction = instructions[instructionName];
    if (
      _matchesConstraints({
        instruction: instruction,
        constraints: constraints,
      })
    ) {
      prunedInstructions[instructionName] = instruction;
    }
  }
  return prunedInstructions;
}

// Makes the pruned instruction into a data structure most similar to a sliderules row
export function tabulateInstructionEncode({ prunedInstruction = {} }) {
  const tabulatedInstructions = [];

  for (const instructionName in prunedInstruction) {
    const instruction = prunedInstruction[instructionName];
    const row = [];

    row.push({ content: instruction.extension, width: 1 });
    row.push({ content: instruction.type, width: 1 });
    row.push({ content: instruction.description, width: 1 });
    row.push({ content: instruction.pseudocode, width: 1 });

    row.push({ content: instructionName, width: 1 });

    const operands = instruction.assembly.join(", ");
    row.push({ content: operands, width: 1 });

    let fieldNames = [];
    for (const fieldName in instruction.fields) {
      const field = instruction.fields[fieldName];
      const position = maskPosition({ mask: field.mask });
      fieldNames.push([fieldName, position]);
    }
    fieldNames.sort((a, b) => b[1] - a[1]);
    fieldNames = fieldNames.map(([fieldName]) => fieldName);
    for (const fieldName of fieldNames) {
      const field = instruction.fields[fieldName];
      const width = maskWidth({ mask: field.mask });
      const rowItem = { content: fieldName, width: width };
      if (field.hasOwnProperty("value")) {
        rowItem.value = field.value;
      }
      row.push(rowItem);
    }

    tabulatedInstructions.push(row);
  }

  return tabulatedInstructions;

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
  mask = mask >>> 0; // this line is to convert the number to unsigned
  const valueLength = mask
    .toString(2)
    .split("")
    .filter((bit) => bit === "1").length;
  return valueLength;
}

// Input: a mask in binary form. Output: position of the most significant bit of the mask.
export function maskPosition({ mask = 0b0 }) {
  mask = mask >>> 0; // this line is to convert the number to unsigned
  if (mask === 0) {
    return -1; // Edge case: If the mask is 0, there is no significant bit
  }
  const maskInStr = mask.toString(2).padStart(32);
  return 31 - maskInStr.search("1");
}

//////////////////////////////////////////////////////////////////////////////////////////
// // Example usage

// const encodedInstruction = encodeInstruction({
//   //assemblyString: "sw x11, 512(x13)",
//   assemblyString: "sb x6, -8(x4)",
// });
// console.log(encodedInstruction.binary);

// // Example usage
// const instructionValue = encodedInstruction.binary; // Need to use '0b' representation
// const decodedInstruction = decodeInstruction({ value: instructionValue });
// console.log(decodedInstruction);

// const constraints = ["-", "1", "-", "-", "-", "-", "-", "-", "1", "-", "1", "1", "-", "-", "-", "-", "-", "0", "0", "0", "1", "0", "-", "0", "0", "0", "1", "1", "0", "0", "1", "1"];
// const filtered = pruneInstructions({ instructions, constraints });
// console.log(filtered);
