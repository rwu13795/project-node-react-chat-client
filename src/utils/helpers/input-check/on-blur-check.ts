import { Dispatch, SetStateAction } from "react";
import { InputFields } from "../../../components/input-field/InputField";
import { inputNames } from "../../enums/input-names";

export const regex_numbers = /^[0-9]*$/;
const regex_email =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function onBlurCheck(
  inputName: string,
  inputValue: string,
  touched: boolean,
  setInputErrors: Dispatch<SetStateAction<InputFields>>
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
      case inputNames.new_password: {
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
      case inputNames.confirm_new_password: {
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
      case inputNames.username: {
        if (inputValue.length > 40) {
          setInputErrors((prev) => {
            return {
              ...prev,
              [inputName]: "Your username cannot be longer than 40 characters",
            };
          });
          hasError = true;
        }
        break;
      }
      case inputNames.new_group_name: {
        if (inputValue.length > 40) {
          setInputErrors((prev) => {
            return {
              ...prev,
              [inputName]: "The group name cannot be longer than 40 characters",
            };
          });
          hasError = true;
        }
        break;
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
        }
        break;
      }

      case inputNames.message: {
        if (inputValue.length > 250) {
          setInputErrors((prev) => {
            return {
              ...prev,
              [inputName]: "The message exceeds 250-charater limit",
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
