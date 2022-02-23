import { Popover } from "@mui/material";
import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import {
  addNewMessageToHistory_memory,
  chatType,
  selectTargetChatRoom,
  setTargetChatRoom,
} from "../../redux/message/messageSlice";
import { createNewGroup } from "../../redux/user/asyncThunk/create-new-group";

import {
  removeGroup,
  selectCreateGroupError,
  selectFriendsList,
  selectTargetGroup,
  selectUserId,
  selectUsername,
} from "../../redux/user/userSlice";
import axios_client from "../../utils/axios-client";

function RemoveGroup(): JSX.Element {
  const dispatch = useDispatch();
  const client = axios_client();

  const currentUserId = useSelector(selectUserId);
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));

  async function removeGroupHandler() {
    const { group_id, was_kicked } = targetGroup;
    await client.post("http://localhost:5000/api/user/remove-group", {
      group_id,
      user_id: currentUserId,
      was_kicked,
    });

    window.alert("group removed!");
    dispatch(removeGroup({ group_id }));
    dispatch(setTargetChatRoom({ id: "", name: "", type: "", date_limit: "" }));
  }

  return (
    <main>
      <button onClick={removeGroupHandler}>
        Remove group --- {targetChatRoom.name}
      </button>
    </main>
  );
}

export default memo(RemoveGroup);
