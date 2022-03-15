import { FormEvent, memo, MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// UI //
import styles from "./ResetPW.module.css";
import styles_2 from "./SignIn.module.css";
import background_2 from "../../images/background_2.jpg";
import {
  clearRequestError,
  selectLoadingStatus_user,
  selectRequestErrors,
  setLoadingStatus_user,
} from "../../redux/user/userSlice";
import { loadingStatusEnum } from "../../utils/enums/loading-status";
import RedirectToSignIn from "../menu/RedirectToSignIn";
import { inputNames } from "../../utils/enums/input-names";
import { InputErrors, InputValues } from "../input/InputField";
import { LoadingButton } from "@mui/lab";
import { onSubmitCheck } from "../../utils/helpers/input-check/__index";

interface Props {
  expirationInMS: number;
}

function ResetPassword({ expirationInMS }: Props): JSX.Element {
  const dispatch = useDispatch();

  const requestErrors = useSelector(selectRequestErrors);
  const loading = useSelector(selectLoadingStatus_user);

  const [second, setSecond] = useState<number>(
    Math.floor((expirationInMS / 1000) % 60) - 1
  );
  const [minute, setMinute] = useState<number>(
    Math.floor(expirationInMS / 1000 / 60)
  );
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const [inputValues, setInputValues] = useState<InputValues>({
    [inputNames.new_password]: "",
    [inputNames.confirm_new_password]: "",
  });
  const [inputErrors, setInputErrors] = useState<InputErrors>({
    [inputNames.new_password]: "",
    [inputNames.confirm_new_password]: "",
  });

  useEffect(() => {
    return () => {
      dispatch(clearRequestError("all"));
      dispatch(setLoadingStatus_user(loadingStatusEnum.idle));
    };
  }, []);

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
  }, [second, minute, expirationInMS]);

  function onSubmitHandler(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();

    const hasError = onSubmitCheck(inputValues, setInputErrors);
    if (hasError) return;
  }

  // function backToSignInHandler() {
  //   navigate("/");
  // }

  return (
    <main className={styles.main} id="main_body">
      <form onSubmit={onSubmitHandler}>
        <LoadingButton
          type="submit"
          variant="contained"
          color="secondary"
          onClick={onSubmitHandler}
          // disabled={
          //   loading === loadingStatus.succeeded || isExpired
          // }
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
            {isExpired ? (
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
