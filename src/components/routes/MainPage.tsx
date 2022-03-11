import { memo, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import {
  chatType,
  setCurrentUserId_message,
} from "../../redux/message/messageSlice";
import {
  selectGroupsToJoin,
  selectIsLoggedIn,
  selectUserId,
  selectUsername,
} from "../../redux/user/userSlice";
import { getNotifications } from "../../redux/message/asyncThunk/get-notifications";

import ChatBoard from "./../chat/ChatBoard";
import RoomLists from "./../room-lists/RoomLists";
import ChatRoomMenu from "./../menu/ChatRoomMenu";

import { connectSocket } from "../../socket-io/socketConnection";
import {
  addFriendRequest_listener,
  addFriendResponse_listener,
  blockFriend_listener,
  check_addFriendRequest_listener,
  check_groupInvitation_listener,
  groupAdminNotification_listener,
  groupInvitation_listener,
  kickedOutOfGroup_listener,
  message_listener,
  offline_listener,
  onlineEcho_listener,
  online_listener,
} from "../../socket-io/listeners/__index";

// UI //
import styles from "./__MainPage.module.css";

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
  const groupsToJoin = useSelector(selectGroupsToJoin);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      dispatch(getNotifications(currentUserId));
      dispatch(setCurrentUserId_message(currentUserId));

      if (socket) return;
      // only initialize the socket once. Pass all the user_id to socket-server to let
      // the server identify this socket-client
      let newSocket: Socket = connectSocket(currentUserId, currentUsername);
      setSocket(newSocket);

      // each user will join his/her private room and all the groups room after signing in
      newSocket.emit("join-room", {
        private_id: `${chatType.private}_${currentUserId}`,
        group_ids: groupsToJoin,
      });
      // let all the friends know this user is online
      newSocket.emit("online");

      // initialize all the listeners //
      message_listener(newSocket, dispatch);

      addFriendRequest_listener(newSocket, dispatch);
      check_addFriendRequest_listener(newSocket, dispatch);
      addFriendResponse_listener(newSocket, dispatch, currentUserId);
      blockFriend_listener(newSocket, dispatch);

      groupInvitation_listener(newSocket, dispatch);
      check_groupInvitation_listener(newSocket, dispatch);
      groupAdminNotification_listener(newSocket, dispatch);
      kickedOutOfGroup_listener(newSocket, dispatch);

      online_listener(newSocket, dispatch);
      onlineEcho_listener(newSocket, dispatch);
      offline_listener(newSocket, dispatch);

      console.log("user signed, socket connected");
    }
  }, [isLoggedIn, socket]);

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
        <h1>Loading ......</h1>
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