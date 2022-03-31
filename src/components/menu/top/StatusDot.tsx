import { memo, useEffect, useLayoutEffect, useState } from "react";

import { AvatarOptions, onlineStatus_enum } from "../../../utils";

// UI //
import styles from "./StatusDot.module.css";

interface Props {
  onlineStatus: string;
  option: AvatarOptions;
}

function StatusDot({ onlineStatus, option }: Props): JSX.Element {
  const [statusDot, setStatusDot] = useState<string>("");

  useEffect(() => {
    let status_dot = "";
    if (option === AvatarOptions.topAvatar) {
      status_dot = styles.status_dot_top_avatar;
    } else if (option === AvatarOptions.listAvatar) {
      status_dot = styles.status_dot_list_avatar;
    } else {
      status_dot = styles.status_dot_selection;
    }
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
    setStatusDot(status_dot);
  }, [onlineStatus, option]);

  return (
    <div className={statusDot}>
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
