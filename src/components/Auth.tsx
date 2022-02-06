import axios from "axios";
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
import { Socket } from "socket.io-client";

import { setFriendChatHistory } from "../utils/redux/messageSlice";
import { selectIsLoggedIn, signIn } from "../utils/redux/userSlice";
import { connectSocket } from "../utils/socketConnection";

interface Props {
  setSocket: React.Dispatch<React.SetStateAction<Socket | undefined>>;
  socket: Socket | undefined;
}

interface InputValues {
  [inputNames: string]: string;
}

function Auth({ setSocket, socket }: Props): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      if (socket) {
        console.log("A existing socket is found !");
      } else {
        let newSocket: Socket = connectSocket();
        setSocket(newSocket);

        // listen all messages sent from server for the current user
        newSocket.on(
          "messageToClients",
          ({ sender_id, receiver_id, body, created_at }) => {
            console.log({ sender_id, receiver_id, body, created_at });
            dispatch(
              setFriendChatHistory({ sender_id, receiver_id, body, created_at })
            );
          }
        );

        console.log("user signed, socket connected");
        navigate("/chat");
      }
    }
  }, [isLoggedIn, socket, setSocket, navigate, dispatch]);

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
