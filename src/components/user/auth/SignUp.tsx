import { FormEvent, MouseEvent, memo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { signUp } from "../../../redux/user/asyncThunk";
import {
  clearRequestError,
  selectLoadingStatus_user,
  selectRequestErrors,
} from "../../../redux/user/userSlice";
import {
  inputNames,
  loadingStatusEnum,
  onSubmitCheck,
  initializeValues,
} from "../../../utils";
import InputField, {
  InputErrors,
  InputValues,
} from "../../input-field/InputField";

// UI //
import styles from "./SignIn.module.css";
import { LoadingButton } from "@mui/lab";

const inputFields = [
  inputNames.email,
  inputNames.username,
  inputNames.password,
  inputNames.confirm_password,
];

function SignUp(): JSX.Element {
  const dispatch = useDispatch();
  const requestErrors = useSelector(selectRequestErrors);
  const loading = useSelector(selectLoadingStatus_user);

  const [inputValues, setInputValues] = useState<InputValues>(
    initializeValues<InputValues>(inputFields)
  );
  const [inputErrors, setInputErrors] = useState<InputErrors>(
    initializeValues<InputErrors>(inputFields)
  );

  function onSubmitHandler(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();

    const hasError = onSubmitCheck(inputValues, setInputErrors);
    if (hasError) return;

    dispatch(
      signUp({
        email: inputValues[inputNames.email],
        username: inputValues[inputNames.username],
        password: inputValues[inputNames.password],
        confirm_password: inputValues[inputNames.confirm_password],
      })
    );
  }

  useEffect(() => {
    return () => {
      dispatch(clearRequestError("all"));
    };
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.title} id="main_title">
        NEW USER SIGN UP
      </div>

      <form onSubmit={onSubmitHandler} id="input_fields">
        {Object.entries(inputValues).map(([name, value]) => {
          return (
            <InputField
              key={name}
              inputName={name}
              inputValue={value}
              inputError={inputErrors[name]}
              requestError={requestErrors[name]}
              setInputValues={setInputValues}
              setInputErrors={setInputErrors}
            />
          );
        })}
        <div className={styles.button_wrapper}>
          <LoadingButton
            type="submit"
            variant="contained"
            color="secondary"
            disabled={loading === loadingStatusEnum.loading}
            loading={loading === loadingStatusEnum.loading}
            onClick={onSubmitHandler}
            className={styles.button}
          >
            Sign Up
          </LoadingButton>
        </div>
      </form>
    </main>
  );
}

export default memo(SignUp);
