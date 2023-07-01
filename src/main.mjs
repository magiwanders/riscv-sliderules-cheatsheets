import { updateSpreadsheet } from './selector.mjs'
import { Selector } from './builders.mjs'

let sliderules = {
  loadInto: (elementID) => {
    document.getElementById(elementID).append(
      Selector()
    )
  },
  updateSpreadsheet: updateSpreadsheet
}

window.sliderules = sliderules
export default sliderules 