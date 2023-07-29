import { encodeInstruction, decodeInstruction, pruneInstructions } from "./isa/helper-functions.mjs";

export function updateEncode() {
    // Retrieve input values
    var assemblyString = document.getElementById('assemblyString').value;
    var encodedValue = encodeInstruction({ assemblyString: assemblyString})
    // Output the result
    // TODO: as soon as the visualization from Siyu is ready, the following line will be substituted by the call to the tabulate and visualization functions.
    document.getElementById('result').innerHTML = 'Encoded result: ' + encodedValue.binary.slice(2);
}

export function updateDecode() {
    var encodedValue = document.getElementById('encodedvalue').value;
    encodedValue = parseInt(encodedValue, 2);
    var decodedResult = decodeInstruction({ value: encodedValue })

    // TODO: as soon as the visualization from Siyu is ready, the following line will be substituted by the call to the tabulate and visualization functions.
    document.getElementById('result').innerHTML = "Decoded result: " + JSON.stringify(decodedResult, null, 2)
}

export function updatePruned() {
    var bitValues = [];
    var prunedInstructions = {}
    var buttons = document.getElementsByClassName('bit-button');
    for (var i = 0; i < buttons.length; i++) {
        var state = buttons[i].textContent;
        var bitValue = state === '1' ? '1' : state === '0' ? '0' : "-";
        bitValues.push(bitValue);
    }

    prunedInstructions = pruneInstructions({ constraints: bitValues })

    const beautifiedJSON = JSON.stringify(prunedInstructions, null, 2)
        .replace(/\\n/g, '<br>')
        .replace(/ /g, '&nbsp;')
        .replace(/"(\w+)":/g, '<strong>"$1":</strong>')
        .replace(/(?:\r\n|\r|\n)/g, '<br>')
        .replace(/\s/g, '&nbsp;');

    // Output the result
    // TODO: as soon as the visualization from Siyu is ready, the following line will be substituted by the call to the tabulate and visualization functions.
    document.getElementById('result').innerHTML = 'Pruned result: ' + beautifiedJSON;
}
