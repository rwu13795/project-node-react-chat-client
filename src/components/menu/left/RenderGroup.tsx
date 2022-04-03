import { memo } from "react";
import { Socket } from "socket.io-client";

import { chatType, Notifications } from "../../../redux/message/messageSlice";
import { Group } from "../../../redux/user/userSlice";
import LeaveGroup from "../../group/LeaveGroup";
import SelectFriendForGroup from "../../group/SelectFriendForGroup";

// UI //
import styles from "./RenderGroup.module.css";
import GroupIcon from "@mui/icons-material/Group";
import { Button, Badge } from "@mui/material";

interface Props {
  group: Group;
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

function RenderGroup({
  group,
  notificationCount,
  socket,
  target_room,
  selectTargetChatRoomHandler,
}: Props): JSX.Element {
  function groupOnClickHandler(
    group_id: string,
    group_name: string,
    user_left_at: string | null
  ) {
    selectTargetChatRoomHandler(
      group_id,
      group_name,
      chatType.group,
      user_left_at
    );
  }

  if (group) {
    let {
      group_id,
      group_name,
      user_left,
      user_left_at,
      admin_user_id,
      was_kicked,
    } = group;
    let room_id = `${chatType.group}_${group_id}`;
    let isTargetRoom =
      room_id === target_room
        ? `${styles.button} ${styles.button_selected}`
        : styles.button;

    return (
      <main className={styles.main}>
        <Button
          id={`${chatType.group}_${group_id}`}
          className={isTargetRoom}
          onClick={() =>
            groupOnClickHandler(group_id, group_name, user_left_at)
          }
        >
          <GroupIcon sx={{ zIndex: 2 }} />
          <div className={styles.button_text}>{group_name}</div>{" "}
          <Badge
            badgeContent={notificationCount}
            color="primary"
            className={styles.badge}
          />
        </Button>
      </main>
    );
  } else {
    return <main></main>;
  }
}

export default memo(RenderGroup);
