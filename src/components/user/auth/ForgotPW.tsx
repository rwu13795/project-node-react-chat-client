import { FormEvent, memo, MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  clearRequestError,
  selectLoadingStatus_user,
  selectRequestErrors,
  setLoadingStatus_user,
} from "../../../redux/user/userSlice";
import InputField, { InputFields } from "../../input-field/InputField";
import { forgotPasswordRequest } from "../../../redux/user/asyncThunk";
import { inputNames, loadingStatusEnum, onSubmitCheck } from "../../../utils";

// UI //
import styles from "./ForgotPW.module.css";
import styles_2 from "./SignIn.module.css";
import background_2 from "../../../images/background_2.webp";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

function ForgotPassword(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectLoadingStatus_user);
  const requestErrors = useSelector(selectRequestErrors);

  const [inputValues, setInputValues] = useState<InputFields>({
    [inputNames.email]: "",
  });
  const [inputErrors, setInputErrors] = useState<InputFields>({
    [inputNames.email]: "",
  });
  const [succeeded, setSucceeded] = useState<boolean>(false);

  // useEffect(() => {
  //   dispatch(clearAuthErrors("all"));
  // }, [dispatch]);

  function onSubmitHandler(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();

    const hasError = onSubmitCheck(inputValues, setInputErrors);
    if (hasError) return;
    dispatch(forgotPasswordRequest({ email: inputValues[inputNames.email] }));
  }

  function backToSignInHandler() {
    navigate("/");
  }

  useEffect(() => {
    if (loading === loadingStatusEnum.succeeded) {
      setSucceeded(true);
      dispatch(setLoadingStatus_user(loadingStatusEnum.idle));
    }
  }, [loading, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearRequestError("all"));
    };
  }, []);

  return (
    <main className={styles.main} id="main_body">
      <div className={styles_2.title} id="main_title">
        RESET PASSWORD
      </div>
      <div className={styles.text_grid}>
        <div className={styles.text}>
          1. Enter the email address connected to your account.
        </div>
        <div className={styles.text}>
          2. Check your inbox for a message from us.
        </div>
        <div className={styles.text}>
          3. Follow the link to reset your password.
        </div>
      </div>

      <form onSubmit={onSubmitHandler}>
        <div className={styles.input_field}>
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
                isDisabled={succeeded}
              />
            );
          })}
        </div>
        <div className={styles_2.button_wrapper}>
          <LoadingButton
            type="submit"
            variant="contained"
            color="secondary"
            onClick={onSubmitHandler}
            className={styles_2.button}
            disabled={succeeded}
          >
            submit
          </LoadingButton>
        </div>
      </form>
      {succeeded && (
        <div className={styles.reset_text}>
          A link for resetting the password has been sent to the email you
          provided.
        </div>
      )}

      <img src={background_2} alt="bg" className={styles.img_wrapper} />
      <div className={styles.button_wrapper}>
        <Button
          variant="contained"
          color="secondary"
          onClick={backToSignInHandler}
          className={styles_2.button}
        >
          Back to Sign In
        </Button>
      </div>
    </main>
  );
}

export default memo(ForgotPassword);
