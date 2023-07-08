import { Encoder, Decoder } from './builders.mjs';
import { updateEncode, updateDecode } from './selector.mjs';


let sliderules = {
  loadInto: (elementID) => {
    document.getElementById(elementID).append(
      Encoder(),
      Decoder()
    )
  },
  updateEncode:updateEncode,
  updateDecode:updateDecode
};

window.sliderules = sliderules;
export default sliderules;