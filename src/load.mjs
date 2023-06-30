import { instructions } from "./isa/instructions.mjs"

export function loadInto(elementID) {
  document.getElementById(elementID).innerHTML = 'Hello Mentorship!!'
}
