export function Selector() {
    return _div({
        id: 'selector'
      }, [
        _input({
          id: 'textinput',
          type: 'text',
          onchange: 'sliderules.updateSpreadsheet()'
        }),
        _div({
          id: 'spreadsheet'
        })
      ])
}

// Recursive renderer for the encode spreadsheet
export function EncodeSpreadsheet({ tabulatedInstructions: {} }) {
}
