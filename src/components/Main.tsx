import axios from "axios";
import { Socket } from "socket.io-client";

interface Props {
  userName: string;
  socket: Socket | undefined;
}

export default function Main({ userName, socket }: Props): JSX.Element {
  function joinRoom() {
    if (socket) {
      socket.emit("joinRoom", userName);
    }
  }
  function emitMessage() {
    const sendTo = window.prompt("send to ...");
    if (socket) {
      socket.emit("messageToServer", {
        sendTo,
        msg: `message from ${userName}`,
      });
    }
  }

  function testApi() {
    axios.get("http://localhost:5000", { withCredentials: true });
  }

  return (
    <div>
      <button onClick={joinRoom}>join room</button>
      <button onClick={emitMessage}>emit message</button>
      <button onClick={testApi}>testApi</button>
    </div>
  );
}
