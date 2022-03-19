import { Dispatch, SetStateAction } from "react";
import { InputErrors } from "../../../components/input-field/InputField";
import { inputNames } from "../../enums/input-names";

export function onChangeCheck(
  inputName: string,
  inputValue: string,
  setInputErrors: Dispatch<SetStateAction<InputErrors>>
): boolean {
  let hasError = false;
  if (
    inputValue.includes(" ") &&
    (inputName === inputNames.password ||
      inputName === inputNames.confirm_password ||
      inputName === inputNames.old_password ||
      inputName === inputNames.new_password ||
      inputName === inputNames.confirm_new_password)
  ) {
    return (hasError = true);
  }

  if (inputName === inputNames.username) {
    if (inputValue.length > 20) {
      setInputErrors((prev) => {
        return {
          ...prev,
          [inputName]: "Your username cannot be longer than 20 characters",
        };
      });
    } else {
      setInputErrors((prev) => {
        return { ...prev, [inputName]: "" };
      });
    }
    return (hasError = false);
  }

  if (inputValue !== "" || inputValue !== undefined) {
    setInputErrors((prev) => {
      return { ...prev, [inputName]: "" };
    });
  }

  return hasError;
}
