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

// Input: a mask in binary form. Output: number of ones in the mask (its width).
export function maskWidth({mask: 0b0}) {

}

// Input: a mask in binary form. Output: position of the most significant bit of the mask.
export function maskPosition({mask: 0b0}) {

}
