import { Dispatch, SetStateAction } from "react";
import { InputErrors } from "../../../components/input/InputField";
import { inputNames } from "../../enums/input-names";

const regex_email =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function onBlurCheck(
  inputName: string,
  inputValue: string,
  touched: boolean,
  setInputErrors: Dispatch<SetStateAction<InputErrors>>
): boolean {
  let hasError = false;
  if (touched && inputValue === "") {
    setInputErrors((prev) => {
      return { ...prev, [inputName]: "Required field" };
    });
    hasError = true;
  }

  if (touched && inputValue !== "") {
    switch (inputName) {
      case inputNames.email: {
        if (!regex_email.test(inputValue.toLowerCase())) {
          setInputErrors((prev) => {
            return {
              ...prev,
              [inputName]: "Please enter a valid email address",
            };
          });
          hasError = true;
        }
        break;
      }
      case inputNames.password: {
        if (inputValue.length < 8) {
          setInputErrors((prev) => {
            return {
              ...prev,
              [inputName]:
                "Password must be between 8 and 20 characters in length",
            };
          });
          hasError = true;
        }
        break;
      }
      case inputNames.confirm_password: {
        if (inputValue.length < 8) {
          setInputErrors((prev) => {
            return {
              ...prev,
              [inputName]:
                "Password must be between 8 and 20 characters in length",
            };
          });
          hasError = true;
        }
        break;
      }

      default:
        break;
    }
  }

  return hasError;
}