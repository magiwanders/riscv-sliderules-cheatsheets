import { instructions } from "./isa/instructions.mjs"

export function loadInto(elementID) {
  document.getElementById(elementID).append(
    _form({
      id: "selector", 
      action: ""
    }, [
      "First:",
      _input({
        type: "text", 
      })
    ])
  )
}
