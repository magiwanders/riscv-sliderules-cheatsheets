import { encodeInstruction, decodeInstruction, pruneInstructions } from "./isa/helper-functions.mjs";

export function updateEncode() {
    // Retrieve input values
    var mnemonic = document.getElementById('mnemonic').value;
    var register1 = document.getElementById('register1').value;
    var register2 = document.getElementById('register2').value;
    var register3 = document.getElementById('register3').value;
    console.log("Registers: ", register1, register2, register3)
    var encodedValue = encodeInstruction({ mnemonic: mnemonic, operands: { rd: register1, rs1: register2, rs2: register3 } })
    // Output the result
    document.getElementById('encodedResult').innerHTML = 'Encoded result: ' + encodedValue.binary;
}

export function updateDecode() {
    var encodedValue = document.getElementById('encodedvalue').value;
    var decodedResult = decodeInstruction({ value: encodedValue })

    document.getElementById('decodedResult').innerHTML = "Decoded result: " + JSON.stringify(decodedResult, null, 2)

}

export function updatePruned() {
    var bitValues = [];
    var prunedInstructions = {}
    var buttons = document.getElementsByClassName('bit-button1');
    for (var i = 0; i < buttons.length; i++) {
        var state = buttons[i].textContent;
        var bitValue = state === '1' ? '1' : state === '0' ? '0' : "-";
        bitValues.push(bitValue);
    }

    prunedInstructions = pruneInstructions({ constraints: bitValues })
    console.log(prunedInstructions)


    const beautifiedJSON = JSON.stringify(prunedInstructions, null, 2)
        .replace(/\\n/g, '<br>')
        .replace(/ /g, '&nbsp;')
        .replace(/"(\w+)":/g, '<strong>"$1":</strong>')
        .replace(/(?:\r\n|\r|\n)/g, '<br>')
        .replace(/\s/g, '&nbsp;');

    // Output the result
    document.getElementById('prunedResult').innerHTML = 'Pruned result: ' + beautifiedJSON;
}




    // 1. BUILD THE CONSTRAINTS
    // 2. Filter Instructions
    // 3. Render instructions -> Siyu
    // User         -> Selector   -----pruneInstructions----> Pruned intructions -----Siyu Work------> Sliderules Spreadsheet
//                    ^
//               Intructions
