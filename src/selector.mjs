import { encodeInstruction, decodeInstruction } from "./isa/helper-functions.mjs";

export function updateEncode() {
    // Retrieve input values
    var mnemonic = document.getElementById('mnemonic').value;
    var register1 = document.getElementById('register1').value;
    var register2 = document.getElementById('register2').value;
    var register3 = document.getElementById('register3').value;
    console.log("Registers: ", register1, register2, register3)
    var encodedValue = encodeInstruction({ mnemonic: mnemonic, operands: { rd: register1, rs1: register2, rs2: register3 } })
    // Output the result
    document.getElementById('encodedResult').innerHTML = 'Encoded result: ' + encodedValue.binary;;
}

export function updateDecode() {
    var bitValues = [];
    for (var i = 0; i < 32; i++) {
      var input = document.getElementById('bitSlider_' + i);
      bitValues.push(parseInt(input.value));
    }
    // Handle the bit values as needed
    console.log('Bit Values:', bitValues);
    return null

}
    // 1. BUILD THE CONSTRAINTS
    // 2. Filter Instructions
    // 3. Render instructions -> Siyu
    // User         -> Selector   -----pruneInstructions----> Pruned intructions -----Siyu Work------> Sliderules Spreadsheet
//                    ^
//               Intructions
