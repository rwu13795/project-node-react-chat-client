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
import RoomLists from "./room-lists/RoomLists";
import ChatRoomMenu from "./menu/right/ChatRoomMenu";
import connectSocket from "../socket-io/socketConnection";

// UI //
import styles from "./HomePage.module.css";
import { CircularProgress } from "@mui/material";

import addAllListeners from "../socket-io/add-all-listener";

interface Props {
  socket: Socket | undefined;
  setSocket: React.Dispatch<React.SetStateAction<Socket | undefined>>;
}

function MainPage({ socket, setSocket }: Props): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const currentOnlineStatus = useSelector(selectUserOnlineStatus);
  const groupsToJoin = useSelector(selectGroupsToJoin);

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

  return (
    <main>
      {isLoggedIn === undefined ? (
        <CircularProgress />
      ) : (
        <div className={styles.main_grid}>
          <div className={styles.left_grid}>
            <RoomLists socket={socket} />
          </div>

          <div className={styles.right_grid}>
            <ChatRoomMenu socket={socket} />
            <ChatBoard socket={socket} />
          </div>
        </div>
      )}
    </main>
  );
}

export default memo(MainPage);
