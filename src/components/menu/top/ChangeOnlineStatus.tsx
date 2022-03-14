import { Button, Popover } from "@mui/material";
import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  onlineStatus_enum,
  setUserOnlineStatus,
} from "../../../redux/user/userSlice";

// UI //
import styles from "./ChangeOnlineStatus.module.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StatusDot from "./StatusDot";

interface Props {
  socket: Socket | undefined;
  onlineStatus: string;
  username: string;
}

function ChangeOnlineStatus({
  socket,
  onlineStatus,
  username,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  function openListHandler(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }

  function selectHandler(status: string) {
    if (socket) socket.emit("online-status-change", status);
    dispatch(setUserOnlineStatus(status));
    handleClose();
  }

  return (
    <main>
      <div className={styles.button_wrapper}>
        <Button onClick={openListHandler} className={styles.button}>
          {username}
          <KeyboardArrowDownIcon />
        </Button>
        <div className={styles.status}>
          {onlineStatus !== onlineStatus_enum.offline
            ? onlineStatus
            : "Appear Offline"}
        </div>
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className={styles.popover_box}>
          {Object.values(onlineStatus_enum).map((status) => {
            return (
              <div key={status} className={styles.status_selection_wrapper}>
                <StatusDot onlineStatus={status} />
                <Button
                  onClick={() => selectHandler(status)}
                  className={styles.status_button}
                >
                  {status === onlineStatus_enum.offline ? "Invisible" : status}
                </Button>
              </div>
            );
          })}
        </div>
      </Popover>
    </main>
  );
}

export default memo(ChangeOnlineStatus);
