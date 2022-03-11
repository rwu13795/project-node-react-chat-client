import { Button, Popover } from "@mui/material";
import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { createNewGroup } from "../../redux/user/asyncThunk/create-new-group";

import {
  onlineStatus_enum,
  setUserOnlineStatus,
} from "../../redux/user/userSlice";

// UI //
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
  }

  return (
    <main>
      <div>
        <Button onClick={openListHandler} style={{ textTransform: "none" }}>
          {username}
          <KeyboardArrowDownIcon />
        </Button>
        <div>{onlineStatus}</div>
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
          {Object.values(onlineStatus_enum).map((status) => {
            return (
              <div key={status}>
                <div>
                  <button onClick={() => selectHandler(status)}>
                    {status === onlineStatus_enum.offline
                      ? "Invisible"
                      : status}
                  </button>
                </div>
              </div>
            );
          })}
        </Popover>
      </div>
    </main>
  );
}

export default memo(ChangeOnlineStatus);
