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
import Auth from "./components/Auth";
import Main from "./components/Main";
import { useDispatch } from "react-redux";
import { getUserStatus } from "./utils/redux/userSlice";

function App(): JSX.Element {
  const dispatch = useDispatch();

  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    dispatch(getUserStatus());
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <div className="App">
        <h1>TESTING</h1>
        <Routes>
          <Route
            path="/"
            element={<Auth socket={socket} setSocket={setSocket} />}
          />
          <Route path="/chat" element={<Main socket={socket} />} />
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
