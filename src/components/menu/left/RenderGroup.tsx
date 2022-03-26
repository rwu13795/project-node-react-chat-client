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
  target_id: string;
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
  target_id,
  selectTargetChatRoomHandler,
}: Props): JSX.Element {
  function groupOnClickHandler(
    group_id: string,
    group_name: string,
    user_left: boolean,
    user_left_at: string | null
  ) {
    if (user_left) {
      window.alert("you were politely kicked out of this group by the creator");
    }
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
      group_id === target_id
        ? `${styles.button} ${styles.button_bg}`
        : styles.button;

    return (
      <main className={styles.main}>
        <Button
          // variant="outlined"
          id={`${chatType.group}_${group_id}`}
          className={isTargetRoom}
          onClick={() =>
            groupOnClickHandler(group_id, group_name, user_left, user_left_at)
          }
        >
          <div className={styles.button_upper}>
            <GroupIcon />
            <div className={styles.button_text}>{group_name}</div>{" "}
            <Badge
              badgeContent={notificationCount}
              color="primary"
              className={styles.badge}
            />
          </div>
          <div className={styles.button_lower}>
            {user_left
              ? was_kicked
                ? "You were kicked out of this group"
                : "You have left this group"
              : ""}
          </div>
          <div>{/* <Badge badgeContent={4} color="primary" /> */}</div>
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

export default memo(RenderGroup);
