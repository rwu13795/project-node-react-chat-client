import { memo } from "react";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { signInWithGoogle } from "../../../redux/user/asyncThunk";
import {
  selectLoadingStatus_user,
  selectRequestErrors,
} from "../../../redux/user/userSlice";
import { loadingStatusEnum } from "../../../utils";

// UI //
import styles from "./GoogleSignIn.module.css";
import logo from "./../../../images/google-logo-2.webp";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  appearOffline: boolean;
}

/* this <GoogleLogin /> component is using the Google OAuth 2.0
   which will be deprecated in 2023.
   
   I changed the google-sign-in by using the Google Identity 
*/

function GoogleSignIn({ appearOffline }: Props): JSX.Element {
  const dispatch = useDispatch();

  const requestError = useSelector(selectRequestErrors);
  const loading = useSelector(selectLoadingStatus_user);

  function handleLogin(
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) {
    if (instanceOf_GoogleLoginResponse(response)) {
      dispatch(signInWithGoogle({ token: response.tokenId, appearOffline }));
    }
  }

  function handleFailure(error: any) {
    console.log(error);
  }

  // since the GoogleLogin is only used to identify the user, and the express-session
  // is not depending on the cookies of the google account, I don't need to use the
  // GoogleLogout. When the express-session expires, the user will need to use
  // the GoogleLogin to identify himself to sign in
  return (
    <div>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
        onSuccess={handleLogin}
        onFailure={handleFailure}
        className={styles.sign_in_button}
        scope="profile"
      >
        {loading === loadingStatusEnum.googleSignIn_loading ? (
          <body>
            <CircularProgress size={30} color="secondary" />
          </body>
        ) : (
          <img src={logo} alt="google-logo" className={styles.logo} />
        )}

        <div className={styles.text}>Sign in with Google</div>
      </GoogleLogin>
      <div className={styles.error}>{requestError["google_auth"]}</div>
    </div>
  );
}

export default memo(GoogleSignIn);

function instanceOf_GoogleLoginResponse(
  response: any
): response is GoogleLoginResponse {
  return true;
}
