// Only export functions that are used outside of this module.

// Generates numeric value given single instruction data structure
export function encodeInstruction({ instruction = {} }) {

}

// Generates single instruction data structure given its numeric value 
export function decodeInstruction({ value = 0b0 }) {
    
}

// Filter the instructions according to constraints.
export function pruneInstructions({ constraints: {} }) {
    // assume the data structure is in scope
    let pruneInstructions = {}
}

// Makes the pruned instruction into a data structure most similar to a sliderules row
export function tabulateInstructionEncode({ prunedInstruction: {}}) {
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
export function maskWidth({mask: 0b0}) {

}

// Input: a mask in binary form. Output: position of the most significant bit of the mask.
export function maskPosition({mask: 0b0}) {

}
