import {
  ChangeEvent,
  FormEvent,
  useState,
  MouseEvent,
  useEffect,
  memo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../../redux/user/asyncThunk/sign-in";
import { signUp } from "../../redux/user/asyncThunk/sign-up";

import { selectAuthErrors, selectIsLoggedIn } from "../../redux/user/userSlice";

interface InputValues {
  [inputNames: string]: string;
}

function Auth(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const authErrors = useSelector(selectAuthErrors);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/chat");
    }
  }, [isLoggedIn, navigate]);

  // async function signUp() {
  //   try {
  //     await axios.post(
  //       "http://localhost:5000/api/auth/sign-up",
  //       { email: userName },
  //       { withCredentials: true }
  //     );
  //   } catch (err: any) {
  //     console.log(err.response);
  //   }
  // }

  const [inputValues, setInputValues] = useState<InputValues>({
    email: "",
    password: "",
  });

  const [inputValuesSignUp, setInputValuesSignUp] = useState<InputValues>({
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  function signInHandler(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();

    dispatch(
      signIn({ email: inputValues.email, password: inputValues.password })
    );
  }

  function signUpHandler(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    const { email, username, password, confirm_password } = inputValuesSignUp;

    if (password !== confirm_password) {
      console.log("passwords not match");
      return;
    }
    dispatch(signUp({ email, username, password, confirm_password }));
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const onChangeHandlerSignUp = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValuesSignUp((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <div>
      <form onSubmit={signInHandler}>
        <div>
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={inputValues.email}
            onChange={onChangeHandler}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="text"
            name="password"
            value={inputValues.password}
            onChange={onChangeHandler}
          />
        </div>
        <button onClick={signInHandler}>sign in</button>
      </form>

      <form onSubmit={signUpHandler}>
        <div>
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={inputValuesSignUp.email}
            onChange={onChangeHandlerSignUp}
          />
          {authErrors["email"]}
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={inputValuesSignUp.username}
            onChange={onChangeHandlerSignUp}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="text"
            name="password"
            value={inputValuesSignUp.password}
            onChange={onChangeHandlerSignUp}
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="text"
            name="confirm_password"
            value={inputValuesSignUp.confirm_password}
            onChange={onChangeHandlerSignUp}
          />
        </div>
        <button onClick={signUpHandler}>sign up</button>
      </form>
    </div>
  );
}

export default memo(Auth);
