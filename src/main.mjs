import { Encoder, Decoder, Pruner } from './builders.mjs';
import { updateEncode, updateDecode, updatePruned } from './selector.mjs';

let sliderules = {
  loadInto: (elementID) => {
    document.getElementById(elementID).append(
      Encoder(), 
      Decoder(),
      Pruner(),
      _div({ id: 'result' }), // No need for each interface to have its own result div. This will be substituted by the visualization by Siyu.
      _div({ id: 'spreadsheet' })
      )
  },
  updateEncode:updateEncode,
  updateDecode:updateDecode,
  updatePruned:updatePruned
};

window.sliderules = sliderules;
export default sliderules;