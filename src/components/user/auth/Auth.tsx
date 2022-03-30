import { useEffect, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  selectIsLoggedIn,
  selectLoadingStatus_user,
  setLoadingStatus_user,
} from "../../../redux/user/userSlice";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

// UI //
import styles from "./Auth.module.css";
import { Button } from "@mui/material";
import { resetAfterSignOut_msg } from "../../../redux/message/messageSlice";
import { loadingStatusEnum } from "../../../utils";

interface Props {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

function Auth({ setIsAuth }: Props): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loadingStatus = useSelector(selectLoadingStatus_user);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [showSignIn, setShowSignIn] = useState<boolean>(true);

  useEffect(() => {
    setIsAuth(true);
    return () => {
      setIsAuth(false);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/chat");
    }
  }, [isLoggedIn, navigate]);

  function toggleShowSignIn() {
    setShowSignIn((prev) => !prev);
  }

  useEffect(() => {
    if (loadingStatus === loadingStatusEnum.signOut_succeeded) {
      // when user sign out and try to login again without refresh the page,
      // the client should reset all the previous store states to prevent some unforeseen circumstances
      dispatch(resetAfterSignOut_msg());
      dispatch(setLoadingStatus_user(loadingStatusEnum.idle));
    }
  }, [loadingStatus, dispatch]);

  return (
    <main className={styles.main}>
      <div className={styles.main_body}>
        {showSignIn ? (
          <>
            <SignIn />
            <div className={styles.create_new_account}>
              New user?{" "}
              <Button
                variant="contained"
                color="secondary"
                className={styles.button}
                onClick={toggleShowSignIn}
              >
                create a new account
              </Button>
            </div>
          </>
        ) : (
          <>
            <SignUp />
            <div className={styles.create_new_account}>
              Have an existing account?
              <Button
                variant="contained"
                color="secondary"
                className={styles.button}
                onClick={toggleShowSignIn}
              >
                To sign in
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default memo(Auth);
