import { Button, Popover } from "@mui/material";
import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  onlineStatus_enum,
  setUserOnlineStatus,
} from "../../../redux/user/userSlice";
import StatusDot from "./StatusDot";

// UI //
import styles from "./ChangeOnlineStatus.module.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { changeOnlineStatus_session } from "../../../redux/user/asyncThunk";
import { changeOnlineStatus_emitter } from "../../../socket-io/emitters";
import { AvatarOptions } from "../../../utils";

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
    if (socket) changeOnlineStatus_emitter(socket, { status });
    dispatch(setUserOnlineStatus(status));
    dispatch(changeOnlineStatus_session({ status }));
    handleClose();
  }

  let color;
  if (onlineStatus === onlineStatus_enum.online) {
    color = styles.color_green;
  } else if (onlineStatus === onlineStatus_enum.away) {
    color = styles.color_yellow;
  } else if (onlineStatus === onlineStatus_enum.busy) {
    color = styles.color_red;
  } else {
    color = styles.color_grey;
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
        <div className={styles.status_border + " " + color}></div>
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
                <Button
                  onClick={() => selectHandler(status)}
                  className={styles.status_button}
                >
                  <StatusDot
                    onlineStatus={status}
                    option={AvatarOptions.none}
                  />
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
