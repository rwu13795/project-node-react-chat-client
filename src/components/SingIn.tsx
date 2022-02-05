import { Link, useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import {
  connectSocket,
  socket_messageToClients_listener,
} from "../utils/socketConnection";

interface Props {
  setSocket: React.Dispatch<React.SetStateAction<Socket | undefined>>;
  socket: Socket | undefined;
}

export default function SignIn({ setSocket, socket }: Props): JSX.Element {
  const navigate = useNavigate();

  function login() {
    if (socket) {
      console.log("A existing socket is found !");
    } else {
      let newSocket: Socket = connectSocket();
      setSocket(newSocket);
      socket_messageToClients_listener(newSocket);
    }
    navigate("/chat");
  }

  return (
    <div>
      <button onClick={login}>log in</button>
      <Link to="/chat">To chat room</Link>;
    </div>
  );
}
