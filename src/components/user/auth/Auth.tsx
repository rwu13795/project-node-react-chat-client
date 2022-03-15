import { useEffect, memo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { selectIsLoggedIn } from "../../../redux/user/userSlice";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

// UI //
import styles from "./Auth.module.css";
import background from "../../../images/background.jpg";
import { Button } from "@mui/material";

function Auth(): JSX.Element {
  const navigate = useNavigate();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [showSignIn, setShowSignIn] = useState<boolean>(true);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/chat");
    }
  }, [isLoggedIn, navigate]);

  function toggleShowSignIn() {
    setShowSignIn((prev) => !prev);
  }

  return (
    <main className={styles.main} id="main_body">
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
          {" "}
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

      <img src={background} alt="bg" className={styles.bg_image} />
    </main>
  );
}

export default memo(Auth);
