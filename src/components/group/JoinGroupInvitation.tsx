import { Popover } from "@mui/material";
import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewGroup } from "../../redux/user/asyncThunk/create-new-group";

import {
  selectCreateGroupError,
  selectFriendsList,
  selectUserId,
} from "../../redux/user/userSlice";

function JoinGroupInvitation(): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const friendsList = useSelector(selectFriendsList);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const openListHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
          {friendsList.map((friend) => {
            return (
              <div key={friend.friend_id}>
                <div>
                  {friend.friend_username} - {friend.friend_email}
                </div>
              </div>
            );
          })}
        </Popover>
      </div>
    </main>
  );
}

export default memo(JoinGroupInvitation);
