import { Dispatch, SetStateAction } from "react";
import { InputFields } from "../../../components/input-field/InputField";
import { inputNames } from "../../enums/input-names";
import { regex_numbers } from "./on-blur-check";

export function onChangeCheck(
  inputName: string,
  inputValue: string,
  setInputErrors: Dispatch<SetStateAction<InputFields>>
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

  switch (inputName) {
    case inputNames.username: {
      if (inputValue.length > 40) {
        setInputErrors((prev) => {
          return {
            ...prev,
            [inputName]: "Your username cannot be longer than 40 characters",
          };
        });
      } else {
        setInputErrors((prev) => {
          return { ...prev, [inputName]: "" };
        });
      }
      return (hasError = false);
    }
    case inputNames.new_group_name: {
      if (inputValue.length > 40) {
        setInputErrors((prev) => {
          return {
            ...prev,
            [inputName]: "The group name cannot be longer than 40 characters",
          };
        });
      } else {
        setInputErrors((prev) => {
          return { ...prev, [inputName]: "" };
        });
      }
      return (hasError = false);
    }

    case "User_ID": {
      if (!regex_numbers.test(inputValue)) {
        setInputErrors((prev) => {
          return {
            ...prev,
            [inputName]: "User ID consists of numbers only",
          };
        });
        hasError = true;
      } else {
        setInputErrors((prev) => {
          return { ...prev, [inputName]: "" };
        });
      }
      return (hasError = false);
    }

    default:
      break;
  }

  if (inputValue !== "" || inputValue !== undefined) {
    setInputErrors((prev) => {
      return { ...prev, [inputName]: "" };
    });
  }

  return hasError;
}
