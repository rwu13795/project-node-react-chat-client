import { FormEvent, memo, MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// UI //
import styles from "./CheckResetToken.module.css";
import styles_2 from "./ForgotPW.module.css";
import background_3 from "../../images/background_3.jpg";
import CircularProgress from "@mui/material/CircularProgress";
import useCheckToken from "../../utils/hooks/useCheckToken";
import ResetPW from "./ResetPW";

function CheckResetToken(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { isValid, isLoading, expirationInMS } = useCheckToken(
    searchParams.get("token"),
    searchParams.get("user_id")
  );

  return (
    <main className={styles_2.main} id="main_body">
      {isLoading ? (
        <CircularProgress className={styles.loading} />
      ) : !isValid ? (
        <div className={styles.expired_link}>
          The link for resetting your password has expired, please make a{" "}
          <Link to="/auth/forgot-password">NEW REQUEST</Link> again.
        </div>
      ) : (
        <ResetPW expirationInMS={expirationInMS} />
      )}
      <img src={background_3} alt="bg" className={styles_2.img_wrapper} />
    </main>
  );
}

export default memo(CheckResetToken);
