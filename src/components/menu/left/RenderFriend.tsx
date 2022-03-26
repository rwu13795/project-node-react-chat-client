import { memo } from "react";
import { Socket } from "socket.io-client";

import { chatType, Notifications } from "../../../redux/message/messageSlice";
import { Friend, Group } from "../../../redux/user/userSlice";

// UI //
import styles from "./RenderFriend.module.css";

import { Button, Badge } from "@mui/material";
import UserAvatar from "../top/UserAvatar";
import { AvatarOptions } from "../../../utils";
import StatusDot from "../top/StatusDot";

interface Props {
  friend: Friend;
  notificationCount: number;
  socket: Socket | undefined;
  target_room: string;
  selectTargetChatRoomHandler: (
    id: string,
    name: string,
    type: string,
    date_limit?: string | null
  ) => void;
}

function RenderFriend({
  friend,
  notificationCount,
  socket,
  target_room,
  selectTargetChatRoomHandler,
}: Props): JSX.Element {
  function friendOnClickHandler(friend_id: string, friend_username: string) {
    selectTargetChatRoomHandler(friend_id, friend_username, chatType.private);
  }

  if (friend) {
    let { friend_id, friend_username, onlineStatus, avatar_url } = friend;
    let room_id = `${chatType.private}_${friend_id}`;
    let isTargetRoom =
      room_id === target_room
        ? `${styles.button} ${styles.button_bg}`
        : styles.button;
    return (
      <main className={styles.main}>
        <Button
          id={`${chatType.private}_${friend_id}`}
          className={isTargetRoom}
          onClick={() => friendOnClickHandler(friend_id, friend_username)}
        >
          <div className={styles.avatar_dot_wrapper}>
            <UserAvatar
              username={friend_username}
              avatar_url={avatar_url}
              socket={socket}
              option={AvatarOptions.listAvatar}
            />
            <StatusDot
              onlineStatus={onlineStatus}
              option={AvatarOptions.listAvatar}
            />
          </div>
          <div className={styles.button_text}>{friend_username}</div>{" "}
          <Badge
            badgeContent={notificationCount}
            color="primary"
            className={styles.badge}
          />
        </Button>
      </main>
    );
  } else {
    return (
      <main>
        <h3>Loading ................</h3>
      </main>
    );
  }
}

export default memo(RenderFriend);
