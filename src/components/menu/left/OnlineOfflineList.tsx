import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  chatType,
  selectFriendsPosition,
  selectFriendNotifications,
} from "../../../redux/message/messageSlice";
import {
  onlineStatus_enum,
  selectFriendsList,
} from "../../../redux/user/userSlice";
import RenderFriend from "./RenderFriend";

// UI //
import styles from "./OnlineOfflineList.module.css";
import styles_2 from "./GroupsList.module.css";

interface Props {
  socket: Socket | undefined;
  isOnline: boolean;
  selectTargetChatRoomHandler: (id: string, name: string, type: string) => void;
}

function OnlineOfflineList({
  socket,
  isOnline,
  selectTargetChatRoomHandler,
}: Props): JSX.Element {
  const friendsList = useSelector(selectFriendsList);
  const friendNotifications = useSelector(selectFriendNotifications);
  const friendsPosition = useSelector(selectFriendsPosition);

  let title = isOnline ? "Online" : "Offline";
  let color = isOnline ? styles.online : styles.offline;

  return (
    <main className={styles.main}>
      <div className={styles.title}>{title}</div>
      <div className={color}></div>
      <div className={styles_2.group_list}>
        {friendsPosition.map((id) => {
          let room_id = `${chatType.private}_${id}`;
          let count = 0;
          if (friendNotifications[room_id]) {
            count = friendNotifications[room_id].count;
          }
          if (isOnline) {
            return friendsList[id].onlineStatus !==
              onlineStatus_enum.offline ? (
              <RenderFriend
                key={id + "_online"}
                socket={socket}
                friend={friendsList[id]}
                notificationCount={count}
                selectTargetChatRoomHandler={selectTargetChatRoomHandler}
              />
            ) : (
              <div key={id + "_online"}></div>
            );
          } else {
            return friendsList[id].onlineStatus ===
              onlineStatus_enum.offline ? (
              <RenderFriend
                key={id + "_offline"}
                socket={socket}
                friend={friendsList[id]}
                notificationCount={count}
                selectTargetChatRoomHandler={selectTargetChatRoomHandler}
              />
            ) : (
              <div key={id + "_offline"}></div>
            );
          }
        })}
      </div>
    </main>
  );
}

export default memo(OnlineOfflineList);
