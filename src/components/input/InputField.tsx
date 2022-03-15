import { ChangeEvent, FocusEvent, memo, useEffect, useState } from "react";

// UI //
import {
  FormControl,
  FormHelperText,
  Grid,
  OutlinedInput,
  InputLabel,
  GridSize,
  useMediaQuery,
} from "@mui/material";

import {
  onBlurCheck,
  onChangeCheck,
  onFocusCheck,
} from "../../utils/helpers/input-check/__index";
import { inputNames } from "../../utils/enums/input-names";
import { useDispatch } from "react-redux";
import { clearRequestError } from "../../redux/user/userSlice";

// UI //
import styles from "./InputField.module.css";
import { capFirstLetter } from "../../utils/helpers/cap-first-letter";

export interface InputValues {
  [inputName: string]: string;
}
export interface InputErrors {
  [inputField: string]: string;
}

interface Props {
  inputName: string;
  inputValue: string;
  inputError: string;
  requestError: string;
  setInputValues: React.Dispatch<React.SetStateAction<InputValues>>;
  setInputErrors: React.Dispatch<React.SetStateAction<InputErrors>>;
  isDisabled?: boolean;
}

function InputField({
  inputName,
  inputValue,
  inputError,
  requestError = "",
  setInputValues,
  setInputErrors,
  isDisabled,
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

  return (
    <main className={styles.main}>
      <FormControl error={showError}>
        <InputLabel htmlFor={inputLabel} className={styles.input_label}>
          {inputLabel}
        </InputLabel>
        <OutlinedInput
          type={inputType}
          required={true}
          multiline={inputName === inputNames.message}
          name={inputName}
          value={inputValue}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          disabled={isDisabled}
          label={inputLabel}
          error={showError}
          className={styles.input_field}
        />
      </FormControl>
      <FormHelperText className={styles.error_text}>
        {requestError}
        {inputError}
      </FormHelperText>
    </main>
  );
}

export default memo(InputField);
