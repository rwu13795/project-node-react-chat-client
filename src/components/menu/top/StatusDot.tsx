import { memo } from "react";

import { onlineStatus_enum } from "../../../redux/user/userSlice";

// UI //
import styles from "./StatusDot.module.css";

interface Props {
  onlineStatus: string;
  forAvatar?: boolean;
}

function StatusDot({ onlineStatus, forAvatar }: Props): JSX.Element {
  let status_dot = forAvatar
    ? styles.status_dot_avatar
    : styles.status_dot_selection;
  switch (onlineStatus) {
    case onlineStatus_enum.online:
      status_dot = status_dot + " " + styles.color_online;
      break;
    case onlineStatus_enum.away:
      status_dot = status_dot + " " + styles.color_away;
      break;
    case onlineStatus_enum.busy:
      status_dot = status_dot + " " + styles.color_busy;
      break;
    case onlineStatus_enum.offline:
      status_dot = status_dot + " " + styles.color_offline;
      break;
  }

  return (
    <div className={status_dot}>
      {onlineStatus === onlineStatus_enum.busy && (
        <div className={styles.dot_busy}></div>
      )}
      {onlineStatus === onlineStatus_enum.away && (
        <div className={styles.dot_away}></div>
      )}
    </div>
  );
}

export default memo(StatusDot);
