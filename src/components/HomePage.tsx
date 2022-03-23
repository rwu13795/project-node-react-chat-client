import { memo, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

import {
  chatType,
  setCurrentUserId_message,
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
import RoomLists from "./room-lists/RoomLists";
import ChatRoomMenu from "./menu/right/ChatRoomMenu";
import connectSocket from "../socket-io/socketConnection";
import {
  addFriendRequest_listener,
  addFriendResponse_listener,
  blockFriend_listener,
  check_addFriendRequest_listener,
  check_groupInvitation_listener,
  groupAdminNotification_listener,
  groupInvitationRequest_listener,
  kickedOutOfGroup_listener,
  message_listener,
  offline_listener,
  onlineEcho_listener,
  online_listener,
} from "../socket-io/listeners";

// UI //
import styles from "./HomePage.module.css";
import { CircularProgress } from "@mui/material";
import { joinRoom_emitter, online_emitter } from "../socket-io/emitters";
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      dispatch(getNotifications({ currentUserId }));
      dispatch(setCurrentUserId_message(currentUserId));

      if (socket) return;
      // only initialize the socket once. Pass all the user_id to socket-server to let
      // the server identify this socket-client
      let newSocket: Socket = connectSocket(currentUserId, currentUsername);
      setSocket(newSocket);

      // each user will join his/her private room and all the groups room after signing in
      joinRoom_emitter(newSocket, {
        user_id: currentUserId,
        group_ids: groupsToJoin,
      });
      // let all the friends know this user is online
      online_emitter(newSocket, { onlineStatus: currentOnlineStatus });

      // initialize all the listeners //
      addAllListeners(newSocket, dispatch, currentUserId);
    }
  }, []);

  useLayoutEffect(() => {
    if (isLoggedIn === undefined) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  return (
    <main>
      {loading ? (
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
