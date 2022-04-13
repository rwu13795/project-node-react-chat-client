import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

import {
  selectLoadingStatus_msg,
  setCurrentUserId_msg,
  setLoadingStatus_msg,
} from "../redux/message/messageSlice";
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
import DragHandleIcon from "@mui/icons-material/DragHandle";
import addAllListeners from "../socket-io/add-all-listener";
import { loadingStatusEnum, resizeMenu } from "../utils";
import { online_emitter } from "../socket-io/emitters";
import ChatRoom from "./menu/right/ChatRoom";

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
  const loadingStatus = useSelector(selectLoadingStatus_msg);

  useEffect(() => {
    setShowFooter(false);
    return () => {
      setShowFooter(true);
    };
  }, []);

  useEffect(() => {
    resizeMenu();
  });

  useEffect(() => {
    if (isLoggedIn === undefined) return;
    if (isLoggedIn === false) {
      navigate("/");
    } else {
      // if getAuth has not finished loading before the selector selected the user_id
      if (!currentUserId) return;
      if (socket) return;

      // only initialize the socket once. Pass all the user_id to socket-server to let
      // the server identify this socket-client
      let newSocket: Socket = connectSocket(currentUserId, currentUsername);

      newSocket.on("connect", () => {
        dispatch(getNotifications({ currentUserId }));
        dispatch(setCurrentUserId_msg(currentUserId));
        setSocket(newSocket);
        // initialize all the listeners //
        addAllListeners(newSocket, dispatch, {
          user_id: currentUserId,
          group_ids: groupsToJoin,
        });

        console.log("client socket connected", newSocket.id);
      });
    }
  }, [isLoggedIn, socket]);

  useEffect(() => {
    if (loadingStatus === loadingStatusEnum.getNotifications_succeeded) {
      // let all the friends know this user is online only after loading all
      // the friendList and notications. So when this client received the echo
      // the friendList[id] will not be undefined
      if (socket) {
        online_emitter(socket, {
          onlineStatus: currentOnlineStatus,
        });
      }
      dispatch(setLoadingStatus_msg(loadingStatusEnum.idle));
    }
  }, [loadingStatus, currentOnlineStatus, socket, dispatch]);

  return (
    <main className={styles.main_grid}>
      {isLoggedIn === undefined ? (
        <CircularProgress />
      ) : (
        <>
          <div
            id="left_menu"
            className={styles.left_grid}
            // onMouseEnter={showResizeHandle}
          >
            <div className={styles.room_list}>
              <RoomLists socket={socket} />
            </div>
            <div className={styles.resize_handle_wrapper}>
              <div className={styles.resize_bar_top}></div>
              <DragHandleIcon
                id="resize_handle"
                className={styles.resize_handle}
              />
              <div className={styles.resize_bar_bot}></div>
            </div>
          </div>

          <div className={styles.right_grid} id="right_menu">
            <ChatRoom socket={socket} />
          </div>
        </>
      )}
    </main>
  );
}

export default memo(MainPage);
