import { instructions } from "./generate_instruction.js"

function filter({ instructions = {}, constraints = {} }) {
    let instructionSubset = { ...instructions };

    // Check if constraints contain RV size (32 or 64)
    if (constraints.rvSize) {
        const rvSize = constraints.rvSize;

        instructionSubset = Object.keys(instructionSubset).reduce((subset, mnemonic) => {
            if (instructionSubset[mnemonic].arch_width === rvSize) {
                subset[mnemonic] = instructionSubset[mnemonic];
            }
            return subset;
        }, {});
    }

    if (constraints.extensions) {
        const extensions = constraints.extensions;

        // Filter instructions based on extensions
        instructionSubset = Object.keys(instructionSubset).reduce((subset, mnemonic) => {
            if (extensions.includes(instructionSubset[mnemonic].extension)) {
                subset[mnemonic] = instructionSubset[mnemonic];
            }
            return subset;
        }, {});
    }

    // Check if constraints contain G instruction
    if (constraints.g) {
        delete instructionSubset.G;
    }

    return instructionSubset;
}


const constraints = {
    rvSize: 32,
    extensions: ["I"],
    g: false,
};

const subset = filter({ instructions, constraints });
console.log(subset);
