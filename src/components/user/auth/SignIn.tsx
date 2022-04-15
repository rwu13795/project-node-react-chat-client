import { FormEvent, MouseEvent, memo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { signIn } from "../../../redux/user/asyncThunk";
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
import InputField, { InputFields } from "../../input-field/InputField";
import GoogleSignIn from "./GoogleSignIn";

// UI //
import styles from "./SignIn.module.css";
import { LoadingButton } from "@mui/lab";
import { Checkbox, useMediaQuery } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const inputFields = [inputNames.email, inputNames.password];

function SignIn(): JSX.Element {
  const dispatch = useDispatch();
  const requestErrors = useSelector(selectRequestErrors);
  const loading = useSelector(selectLoadingStatus_user);
  const isSmall = useMediaQuery("(max-width: 765px)");

  const [inputValues, setInputValues] = useState<InputFields>(
    initializeValues(inputFields)
  );
  const [inputErrors, setInputErrors] = useState<InputFields>(
    initializeValues(inputFields)
  );
  const [appearOffline, setAppearOffline] = useState<boolean>(false);

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
        appearOffline,
      })
    );
  }

  function toggleAppearOffline() {
    setAppearOffline((prev) => !prev);
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
        <div className={styles.appear_offline_wrapper}>
          <div onClick={toggleAppearOffline} className={styles.appear_offline}>
            <Checkbox
              checked={appearOffline}
              checkedIcon={<CheckBoxIcon className={styles.checked} />}
            />
            Appear offline after signing in?
          </div>
        </div>

        <div className={styles.buttons_group}>
          {!isSmall && (
            <Link to="/auth/forgot-password" className={styles.link}>
              Forgot password?
            </Link>
          )}

          <div className={styles.buttons_wrapper}>
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
            <GoogleSignIn appearOffline={appearOffline} />
          </div>

          {isSmall && (
            <Link to="/auth/forgot-password" className={styles.link}>
              Forgot password?
            </Link>
          )}
        </div>
      </form>
    </main>
  );
}

export default memo(SignIn);
