// UI //
import styles from "./UserAvatar.module.css";
import { Avatar } from "@mui/material";
import { onlineStatus_enum } from "../../redux/user/userSlice";

interface Props {
  username: string;
  avatar_url: string | undefined;
  onlineStatus: string;
}

export default function UserAvatar({
  username,
  avatar_url,
  onlineStatus,
}: Props): JSX.Element {
  let status_dot = styles.status_dot;
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
    <main className={styles.main}>
      <Avatar src={avatar_url} alt={username} className={styles.avatar} />
      <div className={status_dot}>
        {onlineStatus === onlineStatus_enum.busy && (
          <div className={styles.dot_busy}></div>
        )}
        {onlineStatus === onlineStatus_enum.away && (
          <div className={styles.dot_away}></div>
        )}
      </div>
    </main>
  );
}
