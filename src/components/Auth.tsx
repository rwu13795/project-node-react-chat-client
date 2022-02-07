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

import { selectIsLoggedIn, signIn } from "../utils/redux/userSlice";

interface InputValues {
  [inputNames: string]: string;
}

function Auth(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);

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

  function signInHandler(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    console.log(inputValues);

    dispatch(
      signIn({ email: inputValues.email, password: inputValues.password })
    );
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prev) => {
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
        <input type="submit" />
      </form>
      {/* <button onClick={signUp}>sign up</button> */}
      <Link to="/chat">To chat room</Link>;
    </div>
  );
}

export default memo(Auth);
