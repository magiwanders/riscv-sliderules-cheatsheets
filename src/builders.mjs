export function Selector() {
  return _div(
    {
      id: 'selector',
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
      _button({ onclick: 'sliderules.updateResult()' }, 'Encode'),
      _div({ id: 'result' })
    ]
  );
}

// Recursive renderer for the encode spreadsheet
export function EncodeSpreadsheet({ tabulatedInstructions: {} }) {
}
