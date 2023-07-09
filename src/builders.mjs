export function Encoder() {
  return _div(
    {
      id: 'encoder',
    },
    [
      _input({
        id: 'mnemonic',
        type: 'text',
      }),
      _br(),
      _input({
        id: 'register1',
        type: 'text',
      }),
      _br(),
      _input({
        id: 'register2',
        type: 'text',
      }),
      _br(),
      _input({
        id: 'register3',
        type: 'text',
      }),
      _br(),
      _button({ onclick: 'sliderules.updateEncode()' }, 'Encode'),
      _div({ id: 'encodedResult' }),
      _br()
    ]
  );
}

export function Decoder() {
  var numButtons = 32;
  var sliders = [];
  for (var i = 0; i < numButtons; i++) {
    var label = _label({ for: 'bitInput_' + i }, + i + ': ');
    var input = _input({ type: 'range', id: 'bitSlider_' + i, class: 'slider-button', min: 0, max: 1, step: 1  });
    sliders.push(label, input)
  }
  sliders.push(
      _br(),
      _button({ onclick: 'sliderules.updateDecode()' }, 'Decode'),
      _div({ id: 'decodedResult' })
  )
  return _div(
    {
      id: 'decoder',
    },
    sliders
  );
}

export function Selector() {
  return _div({
    id: 'selector',
  }, [
    _button(),
  ])
}


// Recursive renderer for the encode spreadsheet
export function EncodeSpreadsheet({ tabulatedInstructions: { } }) {
}
