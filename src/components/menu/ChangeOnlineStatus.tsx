import { Popover } from "@mui/material";
import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { createNewGroup } from "../../redux/user/asyncThunk/create-new-group";

import {
  onlineStatus_enum,
  setUserOnlineStatus,
} from "../../redux/user/userSlice";

interface Props {
  socket: Socket | undefined;
}

function ChangeOnlineStatus({ socket }: Props): JSX.Element {
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
        <button onClick={openListHandler}>Change Status</button>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {Object.values(onlineStatus_enum).map((status) => {
            return (
              <div key={status}>
                <div>
                  <button onClick={() => selectHandler(status)}>
                    {status}
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
