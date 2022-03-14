import { useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  selectRequestErrors,
  selectIsLoggedIn,
} from "../../redux/user/userSlice";
import SignIn from "../user/SignIn";
import SignUp from "../user/SignUp";

function Auth(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const requestErrors = useSelector(selectRequestErrors);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/chat");
    }
  }, [isLoggedIn, navigate]);

  return (
    <main>
      <SignIn />
      <hr />
      <SignUp />
    </main>
  );
}

export default memo(Auth);
