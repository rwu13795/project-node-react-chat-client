import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // (1)

import "./styles/App.css";

import MainNavbar from "./components/menu/top/MainNavbar";
import Auth from "./components/user/auth/Auth";
import HomePage from "./components/HomePage";
import UserProfile from "./components/user/profile/UserProfile";
import { useDispatch } from "react-redux";
import { getUserAuth } from "./redux/user/asyncThunk/get-user-auth";
import { Socket } from "socket.io-client";
import Page404 from "./components/Page404";
import Footer from "./components/menu/bottom/Footer";
import ForgotPassword from "./components/user/auth/ForgotPW";
import CheckResetToken from "./components/user/auth/CheckResetToken";

function App(): JSX.Element {
  const dispatch = useDispatch();

  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    dispatch(getUserAuth());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <div className="navbar">
          <MainNavbar socket={socket} />
        </div>

        <div className="body">
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<CheckResetToken />} />

            <Route
              path="/chat"
              element={<HomePage setSocket={setSocket} socket={socket} />}
            />
            <Route path="profile" element={<UserProfile socket={socket} />} />

            <Route path="/*" element={<Page404 />} />
          </Routes>
        </div>
        <div className="footer">
          <Footer />
        </div>
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
