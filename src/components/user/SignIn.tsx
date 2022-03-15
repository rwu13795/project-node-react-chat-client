import { Button } from "@mui/material";
import { FormEvent, MouseEvent, memo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../redux/user/asyncThunk/sign-in";
import {
  clearRequestError,
  selectLoadingStatus_user,
  selectRequestErrors,
} from "../../redux/user/userSlice";
import { inputNames } from "../../utils/enums/input-names";
import { initializeValues } from "../../utils/helpers/input-check/initialize-values";
import { onSubmitCheck } from "../../utils/helpers/input-check/on-submit-check";
import InputField, { InputErrors, InputValues } from "../input/InputField";
import { loadingStatusEnum } from "../../utils/enums/loading-status";

// UI //
import styles from "./SignIn.module.css";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";

const inputFields = [inputNames.email, inputNames.password];

function SignIn(): JSX.Element {
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
      signIn({
        email: inputValues[inputNames.email],
        password: inputValues[inputNames.password],
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
        USER SIGN IN
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

        <div className={styles.buttons_group}>
          <Link to="/auth/forgot-password" className={styles.link}>
            Forgot password?
          </Link>

          <LoadingButton
            type="submit"
            variant="contained"
            color="secondary"
            disabled={loading === loadingStatusEnum.loading}
            loading={loading === loadingStatusEnum.loading}
            onClick={onSubmitHandler}
            className={styles.button}
          >
            SIGN IN
          </LoadingButton>
        </div>
      </form>
    </main>
  );
}

export default memo(SignIn);
