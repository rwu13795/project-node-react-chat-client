import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  selectGroupsList,
  selectUsername,
  setResult_groupInvitation,
} from "../../redux/user/userSlice";

// UI //
import styles from "./SelectGroupForFriend.module.css";
import { Popover, Tooltip } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

interface Props {
  socket: Socket | undefined;
  friend_id: string;
}

function SelectGroupForFriend({ socket, friend_id }: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUsername = useSelector(selectUsername);
  const groupsList = useSelector(selectGroupsList);

  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);
  const open = Boolean(anchorEl);

  function openListHandler(event: React.MouseEvent<SVGSVGElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }

  function invitationHandler(group_id: string, group_name: string) {
    if (socket)
      socket.emit("group-invitation-request", {
        friend_id,
        group_id,
        group_name,
        inviter_name: currentUsername,
      });
    handleClose();
    // remove the Result_groupInvitation message after 10 second with a collapse transition
    setTimeout(() => {
      let elem = document.getElementById("invitation-result");
      if (elem) elem.style.maxHeight = "0px";
    }, 15000);
    setTimeout(() => {
      // have to collapse the <div> before clear the result_groupInvitation
      // otherwise, the transition will be abrupt due to the removal of the text
      dispatch(setResult_groupInvitation(""));
    }, 16000);
  }

  return (
    <main>
      <Tooltip title="Invite friend to a group">
        <GroupAddIcon
          onClick={openListHandler}
          className={styles.invite_button}
        />
      </Tooltip>
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
          horizontal: "left",
        }}
      >
        {Object.values(groupsList).map((group) => {
          return (
            <div key={group.group_id}>
              <div>
                <button
                  onClick={() =>
                    invitationHandler(group.group_id, group.group_name)
                  }
                >
                  {group.group_name} @ ID{group.group_id}
                </button>
              </div>
            </div>
          );
        })}
      </Popover>
    </main>
  );
}

export default memo(SelectGroupForFriend);
