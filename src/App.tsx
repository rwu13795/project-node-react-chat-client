import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // (1)

import "./App.css";

import { Socket } from "socket.io-client";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import MainChat from "./components/MainChat";
import { useDispatch } from "react-redux";
import { getUserAuth } from "./redux/user/asyncThunk/get-user-auth";

function App(): JSX.Element {
  const dispatch = useDispatch();

  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    dispatch(getUserAuth({ initialize: true }));
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <div className="App">
        <h1>TESTING</h1>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route
            path="/chat"
            element={<MainChat socket={socket} setSocket={setSocket} />}
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
