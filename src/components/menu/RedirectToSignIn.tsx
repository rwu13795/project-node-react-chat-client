import { useState, useEffect, memo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoadingStatus_user } from "../../redux/user/userSlice";
import { loadingStatusEnum } from "../../utils/enums/loading-status";

import styles from "./RedirectToSignIn.module.css";

function RedirectToSignIn(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [countDown, SetCountDown] = useState<number>(6);

  useEffect(() => {
    // count down
    const timer = () => {
      SetCountDown((prev) => {
        if (prev === 0) return 0;
        return prev - 1;
      });
    };
    timer();
    const timerId = setInterval(timer, 1000);

    // redirect time out
    const id = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(timerId);
      clearTimeout(id);
      dispatch(setLoadingStatus_user(loadingStatusEnum.idle));
    };
  }, []);

  return (
    <main className={styles.text}>
      <div>Your passwords has been reset successfully!</div>
      <div className={styles.sub_title}>
        You will be redirected to the sign in page ... in {countDown} seconds
      </div>
    </main>
  );
}

export default memo(RedirectToSignIn);
