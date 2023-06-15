document.addEventListener('DOMContentLoaded', () => {
    console.log('RISC-V Sliderules Cheatsheets Loaded!')
    sliderules.loadInto('container')
    document.getElementById('tester').appendChild(
      _div({id: 'simulation_controls', style: 'height:500px; width:100%; pointer-events:painted;'},
        [
            _button({id: 'toggle_simulation'}, 'Pause'), 'or',
            _button({id: 'step'}, 'Step'), ' the simulation.',
            _br(), _br()
        ]
      )
    )
  }
)