import { FormEvent, memo, MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import InputField, { InputFields } from "../../input-field/InputField";
import {
  clearRequestError,
  selectLoadingStatus_user,
  selectRequestErrors,
  setLoadingStatus_user,
} from "../../../redux/user/userSlice";
import { forgotPasswordReset } from "../../../redux/user/asyncThunk";
import { inputNames, loadingStatusEnum, onSubmitCheck } from "../../../utils";
import RedirectToSignIn from "../../menu/RedirectToSignIn";

// UI //
import styles from "./ResetPW.module.css";
import styles_2 from "./SignIn.module.css";
import { LoadingButton } from "@mui/lab";

interface Props {
  expirationInMS: number;
  token: string | null;
  user_id: string | null;
}

function ResetPassword({ expirationInMS, token, user_id }: Props): JSX.Element {
  const dispatch = useDispatch();

  const requestErrors = useSelector(selectRequestErrors);
  const loading = useSelector(selectLoadingStatus_user);

  const [second, setSecond] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const [inputValues, setInputValues] = useState<InputFields>({
    [inputNames.new_password]: "",
    [inputNames.confirm_new_password]: "",
  });
  const [inputErrors, setInputErrors] = useState<InputFields>({
    [inputNames.new_password]: "",
    [inputNames.confirm_new_password]: "",
  });

  useEffect(() => {
    setSecond(Math.floor((expirationInMS / 1000) % 60));
    setMinute(Math.floor(expirationInMS / 1000 / 60));
    return () => {
      dispatch(clearRequestError("all"));
    };
  }, [expirationInMS]);

  useEffect(() => {
    const countDown = () => {
      if (second > 0) {
        setSecond((prevSec) => prevSec - 1);
      }
      if (second === 0) {
        if (minute === 0) {
          setIsExpired(true);
          return () => {
            clearInterval(timerId);
          };
        } else {
          setSecond(59);
          setMinute((prevMin) => prevMin - 1);
        }
      }
    };
    const timerId = setInterval(countDown, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [second, minute]);

  function onSubmitHandler(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();

    const hasError = onSubmitCheck(inputValues, setInputErrors);
    if (hasError) return;

    if (!token || !user_id) return;
    dispatch(
      forgotPasswordReset({
        token,
        user_id,
        new_password: inputValues[inputNames.new_password],
        confirm_new_password: inputValues[inputNames.confirm_new_password],
      })
    );
  }

  return (
    <main className={styles.main}>
      <form onSubmit={onSubmitHandler} id="input_fields">
        <div className={styles.title}>Reset your password</div>
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
              isDisabled={loading === loadingStatusEnum.succeeded || isExpired}
            />
          );
        })}

        <LoadingButton
          type="submit"
          variant="contained"
          color="secondary"
          onClick={onSubmitHandler}
          disabled={loading === loadingStatusEnum.succeeded || isExpired}
          sx={{ mb: "30px", width: "min(200px, 50vw)" }}
        >
          SUBMIT
        </LoadingButton>
      </form>

      <div>
        {loading === loadingStatusEnum.succeeded ? (
          <RedirectToSignIn />
        ) : (
          <div className={styles.expired_link}>
            {isExpired || loading === loadingStatusEnum.time_out ? (
              <>
                Session time out, please make a{" "}
                <Link to={"/auth/forgot-password"}>NEW REQUEST</Link> again.
              </>
            ) : (
              <>
                Session expires in
                {` 0${minute}`}:{second > 9 ? second : `0${second}`}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default memo(ResetPassword);
