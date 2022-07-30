import { memo, useEffect, useRef } from "react";
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
  selectLoadingStatus_2_user,
  selectLoadingStatus_user,
  selectUserId,
  selectUsername,
  selectUserOnlineStatus,
  setLoadingStatus_2_user,
  setLoadingStatus_user,
} from "../redux/user/userSlice";
import { getNotifications } from "../redux/message/asyncThunk";
import SocketClient from "../socket-io/SocketClient";
import { loadingStatusEnum, resizeMenu } from "../utils";
import { online_emitter } from "../socket-io/emitters";
import RoomLists from "./menu/left/RoomLists";
import ChatRoom from "./menu/right/ChatRoom";

// UI //
import styles from "./HomePage.module.css";
import { CircularProgress, useMediaQuery } from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";

interface Props {
  socket: Socket | undefined;
  setSocket: React.Dispatch<React.SetStateAction<Socket | undefined>>;
  setShowFooter: React.Dispatch<React.SetStateAction<boolean>>;
}

function MainPage({ socket, setSocket, setShowFooter }: Props): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSmall = useMediaQuery("(max-width: 765px)");

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const currentOnlineStatus = useSelector(selectUserOnlineStatus);
  const groupsToJoin = useSelector(selectGroupsToJoin);
  const loadingStatus_user = useSelector(selectLoadingStatus_user);
  const loadingStatus_2_user = useSelector(selectLoadingStatus_2_user);
  const loadingStatus_msg = useSelector(selectLoadingStatus_msg);

  const homePageMainGridRef = useRef<HTMLDivElement | null>(null);

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

      if (socket) {
        return;
      }

      let socketClient = SocketClient.getClient();
      let newSocket = socketClient.connect(currentUserId, currentUsername);

      newSocket.on("connect", () => {
        console.log(isLoggedIn);
        dispatch(getNotifications({ currentUserId }));
        dispatch(setCurrentUserId_msg(currentUserId));

        setSocket(newSocket);
        socketClient.addAllListeners(dispatch, {
          user_id: currentUserId,
          group_ids: groupsToJoin,
        });
      });
    }
  }, [isLoggedIn, socket]);

  useEffect(() => {
    if (
      loadingStatus_user === loadingStatusEnum.addFriend_succeeded &&
      loadingStatus_2_user === loadingStatusEnum.getAuth_succeeded
    ) {
      // after a new friend is added, only getNotifications after the "getAuth"
      // is fulfilled. Otherwise if the "getNotifications" is fulfilled before
      // the "getAuth", the online_emitter will be triggered before
      // the "getAuth" finished updating the new friendList, then if both
      // users are online at the same time, nethier of them will see the online
      // status of each other
      dispatch(getNotifications({ currentUserId }));
      dispatch(setLoadingStatus_user(loadingStatusEnum.idle));
      dispatch(setLoadingStatus_2_user(loadingStatusEnum.idle));
    }
  }, [loadingStatus_user, loadingStatus_2_user, currentUserId, dispatch]);

  useEffect(() => {
    if (loadingStatus_msg === loadingStatusEnum.getNotifications_succeeded) {
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
  }, [loadingStatus_msg, currentOnlineStatus, socket, dispatch]);

  return (
    <main className={styles.main_grid} ref={homePageMainGridRef}>
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
              <RoomLists
                socket={socket}
                homePageMainGridRef={homePageMainGridRef}
              />
            </div>

            {!isSmall && (
              <div className={styles.resize_handle_wrapper}>
                <div className={styles.resize_bar_top}></div>
                <DragHandleIcon
                  id="resize_handle"
                  className={styles.resize_handle}
                />
                <div className={styles.resize_bar_bot}></div>
              </div>
            )}
          </div>

          <div className={styles.right_grid} id="right_menu">
            <ChatRoom
              socket={socket}
              homePageMainGridRef={homePageMainGridRef}
            />
          </div>
        </>
      )}
    </main>
  );
}

export default memo(MainPage);
