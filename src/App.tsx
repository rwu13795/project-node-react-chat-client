import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import socket from "./utils/socketConnection";
import axios from "axios";

function App(): JSX.Element {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const name = window.prompt("enter your name");
    setUserName(name || "no-name");
  }, []);

  function joinRoom() {
    socket.emit("joinRoom", userName);
  }
  function emitMessage() {
    const sendTo = window.prompt("send to ...");
    socket.emit("messageToServer", { sendTo, msg: `message from ${userName}` });
  }

  function testApi() {
    axios.get("http://localhost:5000", { withCredentials: true });
  }

  return (
    <div className="App">
      <div>
        <h1>TESTING</h1>
        <div>
          <button onClick={joinRoom}>join room</button>
          <button onClick={emitMessage}>emit message</button>
          <button onClick={testApi}>testApi</button>
        </div>
      </div>
    </div>
  );
}

export default App;
