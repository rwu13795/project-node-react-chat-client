import { Popover } from "@mui/material";
import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { createNewGroup } from "../../redux/user/asyncThunk/create-new-group";

import {
  leaveGroup,
  selectCreateGroupError,
  selectFriendsList,
  selectUserId,
  selectUsername,
} from "../../redux/user/userSlice";

interface Props {
  socket: Socket | undefined;
  group_id: string;
  group_name: string;
}

function LeaveGroup({ socket, group_id, group_name }: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);

  function leaveGroupHandler() {
    if (socket)
      socket.emit("leave-group", {
        group_id,
        user_id: currentUserId,
      });

    dispatch(leaveGroup(group_id));

    console.log("left the group", group_name);
  }

  return (
    <main>
      <button onClick={leaveGroupHandler}>leave group</button>
    </main>
  );
}

export default memo(LeaveGroup);
