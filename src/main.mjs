import { Encoder, Decoder, Pruner } from './builders.mjs';
import { updateEncode, updateDecode, updatePruned } from './selector.mjs';


let sliderules = {
  loadInto: (elementID) => {
    document.getElementById(elementID).append(
      //Selector(),
      Encoder(),
      Decoder(),
      Pruner()
    )
  },
  updateEncode:updateEncode,
  updateDecode:updateDecode,
  updatePruned:updatePruned
};

window.sliderules = sliderules;
export default sliderules;