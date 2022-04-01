import { Dispatch, SetStateAction } from "react";
import { InputFields } from "../../../components/input-field/InputField";
import { onBlurCheck } from "./on-blur-check";

export function onSubmitCheck(
  inputValues: InputFields,
  setInputErrors: Dispatch<SetStateAction<InputFields>>
): boolean {
  let hasError = false;

  // set error on the un-touched empty field
  for (let [name, value] of Object.entries(inputValues)) {
    if (value === "") {
      setInputErrors((prev) => {
        return { ...prev, [name]: "Required field" };
      });
      hasError = true;
    }
  }
  if (hasError) return hasError;

  // if the user hits "enter" to sumbit the form, the last input field might
  // not be checked by the onBlurCheck. Have to use the onBlurCheck here
  for (let [name, value] of Object.entries(inputValues)) {
    hasError = onBlurCheck(name, value, true, setInputErrors);
    if (hasError) return hasError;
  }

  return hasError;
}
