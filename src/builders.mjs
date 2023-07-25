
export function Encoder() {
  return _div(
    {
      class: 'input-wrapper',
      id: 'encoder',
    },
    [
      _input({
        id: 'assemblyString',
        type: 'text',
        placeholder: 'Assembly string',
      }),
      _br(),
      _button({ onclick: 'sliderules.updateEncode()' }, 'Encode'),
      _br()
    ]
  );
}




export function Decoder() {
  return _div(
    {
      id: 'decoder',
    },
    [
      _div(
        { class: 'input-wrapper' },
        [
          _input({
            id: 'encodedvalue',
            type: 'text',
            placeholder: 'Enter 32 bit binary value to decode, like: 00000000001000001000000000110011',
          }),
        ]
      ),
      _br(),
      _button({ onclick: 'sliderules.updateDecode()' }, 'Decode'),
      _br()
    ]
  );
}

export function Pruner() {
  var numButtons = 32;
  var sliders = [];
  var states = ['', '0', '1'];

  function toggleBitValue(event) {
    var button = event.target;
    var currentStateIndex = states.indexOf(button.textContent);
    var nextStateIndex = (currentStateIndex + 1) % states.length;
    button.textContent = states[nextStateIndex];
  }
  for (var i = 0; i < numButtons; i++) {
    var button = _button({ class: 'bit-button1', textContent: '' });
    button.addEventListener('click', toggleBitValue);
    sliders.push(button)
  }
  sliders.push(
    _br(),
    _button({ onclick: 'sliderules.updatePruned()' }, 'Get the instructions'),
  )
  return _div(
    {
      id: 'pruner',
    },
    sliders
  );
}

// Recursive renderer for the encode spreadsheet
export function EncodeSpreadsheet({ tabulatedInstructions: { } }) {
}
