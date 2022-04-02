import { Popover } from "@mui/material";
import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  selectFriendsList,
  selectUserId,
  selectUsername,
  setResult_groupInvitation,
} from "../../redux/user/userSlice";
import { groupInvitationRequest_emitter } from "../../socket-io/emitters";

interface Props {
  socket: Socket | undefined;
  group_id: string;
  group_name: string;
  admin_user_id: string;
}

function InviteFriendToGroup({
  socket,
  group_id,
  group_name,
  admin_user_id,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const friendsList = useSelector(selectFriendsList);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  function openListHandler(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }

  function invitationHandler(friend_id: string) {
    if (socket) {
      groupInvitationRequest_emitter(socket, {
        friend_id,
        group_id,
        group_name,
        admin_user_id,
      });
    }
    handleClose();
    setTimeout(() => {
      dispatch(setResult_groupInvitation(""));
    }, 20000);
  }

  return (
    <main>
      <div>
        <button onClick={openListHandler}>Invite Friends</button>
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
          {Object.values(friendsList).map((friend) => {
            return (
              <div key={friend.friend_id}>
                <div>
                  <button onClick={() => invitationHandler(friend.friend_id)}>
                    {friend.friend_username} - {friend.friend_email}
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

export default memo(InviteFriendToGroup);
