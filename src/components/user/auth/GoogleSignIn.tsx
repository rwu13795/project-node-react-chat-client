import { memo } from "react";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { useDispatch } from "react-redux";

// UI //
import styles from "./GoogleSignIn.module.css";

function GoogleSignIn(): JSX.Element {
  const dispatch = useDispatch();

  function handleLogin(
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) {
    console.log(response);
  }
  function handleFailure(error: any) {
    console.log(error);
  }

  console.log(
    "process.env.GOOGLE_CLIENT_ID",
    process.env.REACT_APP_GOOGLE_CLIENT_ID
  );

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
      onSuccess={handleLogin}
      onFailure={handleFailure}
      className={styles.sign_in_button}
    >
      aaa
    </GoogleLogin>
  );
}

export default memo(GoogleSignIn);
