import { Selector } from './builders.mjs';
import { updateResult } from './selector.mjs';

let sliderules = {
  loadInto: (elementID) => {
    document.getElementById(elementID).append(
      Selector()
    )
  },
  updateResult:updateResult
};

window.sliderules = sliderules;
export default sliderules;