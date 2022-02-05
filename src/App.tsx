import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // (1)

import "./App.css";

// import {
//   connectSocket,
//   socket_messageToClients_listener,
// } from "./utils/socketConnection";
// import axios from "axios";
import { Socket } from "socket.io-client";
import Navbar from "./components/Navbar";
import SignIn from "./components/SingIn";
import Main from "./components/Main";

function App(): JSX.Element {
  const [userName, setUserName] = useState<string>("");

  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const name = window.prompt("enter your name");
    setUserName(name || "no-name");
  }, []);

  return (
    <Router>
      <Navbar />

      <div className="App">
        <h1>TESTING</h1>
        <Routes>
          <Route
            path="/"
            element={<SignIn socket={socket} setSocket={setSocket} />}
          />
          <Route
            path="/chat"
            element={<Main userName={userName} socket={socket} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

/*
(1) <Switch /> <Redirect /> and other properties that used in the Redux
    tutorial is depreciated !

    read the tutorial below for new syntax
    https://github.com/remix-run/react-router/blob/main/docs/getting-started/tutorial.md
 */
//
