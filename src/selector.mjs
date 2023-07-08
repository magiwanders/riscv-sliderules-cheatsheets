import { encodeInstruction } from "./isa/helper-functions.mjs";

export function updateResult() {
    // Retrieve input values
    var mnemonic = document.getElementById('mnemonic').value;
    var register1 = document.getElementById('register1').value;
    var register2 = document.getElementById('register2').value;
    var register3 = document.getElementById('register3').value;
    console.log("Registers: ", register1, register2, register3)
    var encodedValue = encodeInstruction({ mnemonic: mnemonic, operands: { rd: register1, rs1: register2, rs2: register3 } })
    // Output the result
    document.getElementById('result').innerHTML = 'Encoded result: ' + encodedValue.binary;;
}
    // 1. BUILD THE CONSTRAINTS
    // 2. Filter Instructions
    // 3. Render instructions -> Siyu
    // User         -> Selector   -----pruneInstructions----> Pruned intructions -----Siyu Work------> Sliderules Spreadsheet
//                    ^
//               Intructions
