import { memo, useEffect, useState } from "react";
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
} from "../redux/user/userSlice";
import { connectSocket } from "../socket-io/socketConnection";
import ChatBoard from "./chat/ChatBoard";
import { message_listener } from "../socket-io/listeners/message-listener";
import { getNotifications } from "../redux/message/asyncThunk/get-notifications";

import SearchUser from "./friend/SearchUser";
import { addFriendRequest_listener } from "../socket-io/listeners/add-friend-request-listener";
import { check_addFriendRequest_listener } from "../socket-io/listeners/check-add-friend-request-listener";
import { addFriendResponse_listener } from "../socket-io/listeners/add-friend-response-listener";

import { online_listener } from "../socket-io/listeners/online-listener";
import { onlineEcho_listener } from "../socket-io/listeners/online-echo-listener";
import { offline_listener } from "../socket-io/listeners/offline-listener";

// UI //
import styles from "./__MainPage.module.css";
import RoomLists from "./room-lists/RoomLists";
import { check_groupInvitation_listener } from "../socket-io/listeners/check-group-invitation-listener";
import { groupInvitation_listener } from "../socket-io/listeners/group-invitation-listener";
import ChatRoomMenu from "./menu/ChatRoomMenu";
import { groupAdminNotification_listener } from "../socket-io/listeners/group-admin-notification-listener";
import { kickedOutOfGroup_listener } from "../socket-io/listeners/kicked-out-of-group-listener";
import { blockFriend_listener } from "../socket-io/listeners/block-friend-listener";

function MainPage(): JSX.Element {
  const [socket, setSocket] = useState<Socket>();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const groupsToJoin = useSelector(selectGroupsToJoin);

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

  return (
    <main>
      <div className={styles.main_grid}>
        <div className={styles.left_grid}>
          <br />
          <RoomLists socket={socket} />
        </div>

        <div className={styles.right_grid}>
          <SearchUser socket={socket} />
          <hr />
          <ChatRoomMenu socket={socket} />
          <hr />
          <ChatBoard socket={socket} />
        </div>
      </div>
    </main>
  );
}

export default memo(MainPage);
