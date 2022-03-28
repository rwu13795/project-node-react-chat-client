import { ChangeEvent, FocusEvent, memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { clearRequestError } from "../../redux/user/userSlice";
import { capFirstLetter } from "../../utils/helpers/cap-first-letter";
import {
  inputNames,
  onFocusCheck,
  onBlurCheck,
  onChangeCheck,
} from "../../utils";

// UI //
import styles from "./InputField.module.css";
import {
  FormControl,
  FormHelperText,
  OutlinedInput,
  InputLabel,
  useMediaQuery,
  TextField,
} from "@mui/material";

export interface InputValues {
  [inputName: string]: string;
}
export interface InputErrors {
  [inputField: string]: string;
}

export enum customStyleOptions {
  default = "default",
  change_user_name = "change_user_name",
  create_new_group = "create_new_group",
}

interface Props {
  inputName: string;
  inputValue: string;
  inputError: string;
  requestError: string;
  setInputValues: React.Dispatch<React.SetStateAction<InputValues>>;
  setInputErrors: React.Dispatch<React.SetStateAction<InputErrors>>;
  isDisabled?: boolean;
  customStyle?: customStyleOptions;
}

function InputField({
  inputName,
  inputValue,
  inputError,
  requestError = "",
  setInputValues,
  setInputErrors,
  isDisabled,
  customStyle = customStyleOptions.default,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const isSmall = useMediaQuery("(max-width: 765px)");

  const [touched, setTouched] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const regex = /[_]/g;
  const inputLabel = capFirstLetter(inputName.replace(regex, " "));

  let inputType = inputName;
  if (
    inputName === inputNames.password ||
    inputName === inputNames.confirm_password ||
    inputName === inputNames.old_password ||
    inputName === inputNames.new_password ||
    inputName === inputNames.old_password ||
    inputName === inputNames.confirm_new_password
  ) {
    inputType = inputNames.password;
  }

  function onFocusHandler() {
    onFocusCheck(setTouched);
  }

  function onBlurHandler(e: FocusEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget;
    onBlurCheck(name, value, touched, setInputErrors);
  }

  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const hasError = onChangeCheck(name, value, setInputErrors);
    if (hasError) return;

    setInputValues((prev) => {
      return { ...prev, [name]: value };
    });

    dispatch(clearRequestError(name));
  }

  useEffect(() => {
    if (inputError !== "" || requestError !== "") {
      setShowError(true);
    } else {
      setShowError(false);
    }
  }, [inputError, requestError]);

  let content: JSX.Element = <></>;
  let error_text: string = "";
  switch (customStyle) {
    case customStyleOptions.default:
    case customStyleOptions.create_new_group:
      let useMultiline =
        inputName === inputNames.message ||
        customStyle === customStyleOptions.create_new_group;
      error_text = styles.error_text_default;
      content = (
        <>
          <InputLabel htmlFor={inputLabel} className={styles.input_label}>
            {inputLabel}
          </InputLabel>
          <OutlinedInput
            type={inputType}
            required={true}
            multiline={useMultiline}
            name={inputName}
            value={inputValue}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            disabled={isDisabled}
            label={inputLabel}
            error={showError}
            className={styles.input_field_default}
          />
        </>
      );
      break;

    case customStyleOptions.change_user_name:
      error_text =
        styles.error_text_default + " " + styles.error_text_change_user_name;
      content = (
        <>
          <TextField
            variant="standard"
            type={inputType}
            required={true}
            multiline={true}
            name={inputName}
            value={inputValue}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            disabled={isDisabled}
            error={showError}
            className={styles.input_field_change_user_name}
          />
        </>
      );
      break;
  }

  return (
    <main className={styles.main}>
      <FormControl error={showError}>{content}</FormControl>
      <FormHelperText className={error_text}>
        {requestError}
        {inputError}
      </FormHelperText>
    </main>
  );
}

export default memo(InputField);
