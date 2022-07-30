import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // (1)
import { useIdleTimer } from "react-idle-timer";
import { Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";

import "./styles/App.css";

import MainNavbar from "./components/menu/top/MainNavbar";
import Auth from "./components/user/auth/Auth";
import HomePage from "./components/HomePage";
import UserProfile from "./components/user/profile/UserProfile";
import { getUserAuth } from "./redux/user/asyncThunk/get-user-auth";
import Page404 from "./components/Page404";
import Footer from "./components/menu/bottom/Footer";
import ForgotPassword from "./components/user/auth/ForgotPW";
import CheckResetToken from "./components/user/auth/CheckResetToken";
import {
  selectIsLoggedIn,
  setIsLoggedIn,
  setOpenAlertModal_timeOut,
} from "./redux/user/userSlice";
import TimeOutModal from "./components/app-modal/TimeOutModal";
import { logout_emitter } from "./socket-io/emitters";
import { signOut } from "./redux/user/asyncThunk";
import AlertModalTimeOut from "./components/app-modal/AlertModalTimeOut";
import AlertModalSameUser from "./components/app-modal/AlertModalSameUser";

function App(): JSX.Element {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [socket, setSocket] = useState<Socket | undefined>();
  const [showFooter, setShowFooter] = useState<boolean>(true);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [openTimeOutModal, setOpenTimeOutModal] = useState<boolean>(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout>();

  useEffect(() => {
    dispatch(getUserAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoggedIn) setSocket(undefined);
  }, [isLoggedIn]);

  function handleCloseTimeOutModal() {
    setOpenTimeOutModal(false);
  }
  function handleSignOut() {
    handleCloseTimeOutModal();
    if (socket) {
      logout_emitter(socket);
    }
    dispatch(signOut());
    socket?.disconnect();
    dispatch(setIsLoggedIn(false));
    dispatch(setOpenAlertModal_timeOut(true));
  }
  function handleStaySignedIn() {
    if (timerId) clearTimeout(timerId);
    reset();
    handleCloseTimeOutModal();
  }

  function handleOnIdle() {
    // when user is idle for a period of specific time, this callback will be triggered
    if (isLoggedIn) {
      setOpenTimeOutModal(true);
      // open the modal for 1 min, if user did not choose to stay signed in log the user out
      const id = setTimeout(() => {
        handleSignOut();
      }, 1000 * 60);
      setTimerId(id);
    }
  }
  const { reset } = useIdleTimer({
    timeout: 1000 * 60 * 15, // 15 mins
    onIdle: handleOnIdle,
    debounce: 500,
  });

  return (
    <Router>
      <div className="App">
        <div className={isAuth ? "navbar_1" : "navbar_2"}>
          <MainNavbar socket={socket} />
        </div>

        <div className="body">
          <Routes>
            <Route
              path="/"
              element={<Auth setIsAuth={setIsAuth} resetTimeOut={reset} />}
            />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<CheckResetToken />} />

            <Route
              path="/chat"
              element={
                <HomePage
                  socket={socket}
                  setSocket={setSocket}
                  setShowFooter={setShowFooter}
                />
              }
            />
            <Route
              path="/profile"
              element={<UserProfile socket={socket} setSocket={setSocket} />}
            />

            <Route path="/*" element={<Page404 />} />
          </Routes>
        </div>

        {showFooter && (
          <div className={isAuth ? "footer_1" : "footer_2"}>
            <Footer />
          </div>
        )}
      </div>

      <TimeOutModal
        oponModal={openTimeOutModal}
        handleStaySignedIn={handleStaySignedIn}
        handleSignOut={handleSignOut}
      />
      <AlertModalTimeOut />
      <AlertModalSameUser />
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
