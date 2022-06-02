import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CredentialResponse } from "google-one-tap";

import { signInWithGoogle } from "../../../redux/user/asyncThunk";
import { selectLoadingStatus_user } from "../../../redux/user/userSlice";
import { loadingStatusEnum } from "../../../utils";

// UI //
import styles from "./GoogleSignIn.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useScript } from "../../../utils/hooks/useScript";

interface Props {
  appearOffline: boolean;
}

function GoogleSignIn({ appearOffline }: Props): JSX.Element {
  const dispatch = useDispatch();

  const scriptLoadStatus = useScript("https://accounts.google.com/gsi/client");
  const loading = useSelector(selectLoadingStatus_user);

  async function handleCallbackResponse(response: CredentialResponse) {
    // when the user successfully logged in using his/her google account
    // the client will receive a token which we will need to decode in the server
    // and extract the user's info
    dispatch(signInWithGoogle({ token: response.credential, appearOffline }));
  }

  useEffect(() => {
    // only initialize the google identity button after the script is loaded
    if (scriptLoadStatus === "ready") {
      // initialize the google client
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
        callback: handleCallbackResponse,
      });

      const signInButton = document.getElementById("google-sign-in");
      if (signInButton) {
        // render a google sign-in button
        google.accounts.id.renderButton(
          signInButton,
          // find more options in the api document https://developers.google.com/identity/gsi/web/reference/js-reference
          { theme: "filled_blue", size: "large", width: 200 }
        );
      }

      // one-tap signin
      google.accounts.id.prompt();
    }
  }, [scriptLoadStatus]);

  return (
    <>
      {loading === loadingStatusEnum.googleSignIn_loading ? (
        <CircularProgress size={30} color="secondary" />
      ) : (
        <div id="google-sign-in" className={styles.button_wrapper}></div>
      )}
    </>
  );
}

export default memo(GoogleSignIn);
