import { memo } from "react";
import GoogleLogin from "react-google-login";

function GoogleLoginComponent(): JSX.Element {
  return <div></div>;

  //   return <GoogleLogin clientId={process.env.GOOGLE_CLIENT_ID!} buttonText="log in"
  //   onSuccess={handleLogin}
  //   onFailure={handleFailure}

  //   ></GoogleLogin>;
}

export default memo(GoogleLoginComponent);
