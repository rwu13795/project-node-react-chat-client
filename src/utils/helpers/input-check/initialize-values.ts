import { InputFields } from "../../../components/input-field/InputField";
import { inputNames } from "../../enums/input-names";

export function initializeValues(inputFields: inputNames[]) {
  const object: InputFields = {};
  for (let field of inputFields) {
    object[field] = "";
  }
  return object;
}
