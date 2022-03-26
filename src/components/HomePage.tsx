import { memo, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

import { setCurrentUserId_message } from "../redux/message/messageSlice";
import {
  selectGroupsToJoin,
  selectIsLoggedIn,
  selectUserId,
  selectUsername,
  selectUserOnlineStatus,
} from "../redux/user/userSlice";
import { getNotifications } from "../redux/message/asyncThunk";
import ChatBoard from "./chat/ChatBoard";
import RoomLists from "./menu/left/RoomLists";
import ChatRoomMenu from "./menu/right/ChatRoomMenu";
import connectSocket from "../socket-io/socketConnection";

// UI //
import styles from "./HomePage.module.css";
import { CircularProgress } from "@mui/material";

import addAllListeners from "../socket-io/add-all-listener";

interface Props {
  socket: Socket | undefined;
  setSocket: React.Dispatch<React.SetStateAction<Socket | undefined>>;
  setShowFooter: React.Dispatch<React.SetStateAction<boolean>>;
}

function MainPage({ socket, setSocket, setShowFooter }: Props): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const currentOnlineStatus = useSelector(selectUserOnlineStatus);
  const groupsToJoin = useSelector(selectGroupsToJoin);

  useEffect(() => {
    setShowFooter(false);
    return () => {
      setShowFooter(true);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn === undefined) return;
    if (isLoggedIn === false) {
      navigate("/");
    } else {
      // if getAuth has not finished loading before the selector selected the user_id
      if (!currentUserId) return;
      dispatch(getNotifications({ currentUserId }));
      dispatch(setCurrentUserId_message(currentUserId));

      if (socket) return;
      // only initialize the socket once. Pass all the user_id to socket-server to let
      // the server identify this socket-client
      let newSocket: Socket = connectSocket(currentUserId, currentUsername);
      setSocket(newSocket);
      // initialize all the listeners //
      addAllListeners(newSocket, dispatch, {
        user_id: currentUserId,
        group_ids: groupsToJoin,
        onlineStatus: currentOnlineStatus,
      });
    }
  }, [isLoggedIn, socket, currentUserId]);

  // /////////////////////////////////////
  // const [target, setTarget] = useState<HTMLElement | null>(null);

  function resizeLeftMenu() {
    let distance = 0,
      startClientX = 0;

    let elem = document.getElementById("resize_box");
    let leftMenu = document.getElementById("left_menu");
    if (!elem || !leftMenu) return;

    // otherwise, move the DIV from anywhere inside the DIV:
    elem.onmousedown = dragOnMouseDown;

    function dragOnMouseDown(e: MouseEvent) {
      e.preventDefault();
      // get the mouse cursor position at startup:
      startClientX = e.clientX;

      document.onmouseup = clearListeners;
      // call a function whenever the cursor moves:
      document.onmousemove = dragElement;
    }

    function dragElement(e: MouseEvent) {
      e.preventDefault();
      // calculate the new cursor position:
      distance = startClientX - e.clientX;
      startClientX = e.clientX;

      console.log("startClientX", startClientX);
      console.log("distance", distance);

      // set the element's new position:
      if (!elem || !leftMenu) return;

      console.log("leftMenu.style.width", leftMenu.style.width);
      console.log("leftMenu.offsetWidth", leftMenu.offsetWidth);
      console.log("elem.offsetLeft", elem.offsetLeft);
      // console.dir(leftMenu);
      let width = leftMenu.scrollWidth - distance;
      if (width > 500) {
        leftMenu.style.width = 500 + "px";
      } else if (width < 250) {
        leftMenu.style.width = 250 + "px";
      } else {
        leftMenu.style.width = width + "px";
      }
      let pos = elem.offsetLeft - distance;
      if (pos > 460) {
        elem.style.left = 460 + "px";
      } else if (pos < 250) {
        elem.style.left = 250 + "px";
      } else {
        elem.style.left = pos + "px";
      }
    }

    function clearListeners() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  useEffect(() => {
    resizeLeftMenu();
  });

  return (
    <main className={styles.main_grid}>
      {isLoggedIn === undefined ? (
        <CircularProgress />
      ) : (
        <>
          <div className={styles.left_grid} id="left_menu">
            <div className={styles.room_list}>
              <RoomLists socket={socket} />
            </div>
            <div
              id="resize_box"
              className={styles.resize_button}
              // onMouseDown={resizeHanlder}
              // onMouseUp={cancelHandler}
              // onMouseOut={cancelHandler}
            ></div>
          </div>

          <div className={styles.right_grid}>
            <div className={styles.menu_wrapper}>
              <ChatRoomMenu socket={socket} />
              <ChatBoard socket={socket} />
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default memo(MainPage);
