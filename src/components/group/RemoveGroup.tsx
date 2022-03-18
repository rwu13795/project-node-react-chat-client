import { ChangeEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectTargetChatRoom,
  setTargetChatRoom,
} from "../../redux/message/messageSlice";
import {
  removeGroup,
  selectCreateGroupError,
  selectFriendsList,
  selectTargetGroup,
  selectUserId,
  selectUsername,
} from "../../redux/user/userSlice";
import { client } from "../../redux/utils";

function RemoveGroup(): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));

  // remove the group from groupList after leaving or being kicked
  async function removeGroupHandler() {
    const { group_id, was_kicked } = targetGroup;
    await client.post("http://localhost:5000/api/user/remove-group", {
      group_id,
      user_id: currentUserId,
      was_kicked,
    });

    dispatch(setTargetChatRoom({ id: "", name: "", type: "", date_limit: "" }));
    dispatch(removeGroup({ group_id }));
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
