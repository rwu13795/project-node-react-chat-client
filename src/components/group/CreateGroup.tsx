import { ChangeEvent, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { chatType } from "../../redux/message/messageSlice";
import { createNewGroup } from "../../redux/user/asyncThunk";
import {
  selectCreateGroupError,
  selectLoadingStatus_user,
  selectNewGroupToJoin,
  selectUserId,
  setLoadingStatus_user,
} from "../../redux/user/userSlice";
import { loadingStatusEnum } from "../../utils";
import { createNewGroup_emitter } from "../../socket-io/emitters";

interface Props {
  socket: Socket | undefined;
  selectTargetChatRoomHandler: (id: string, name: string, type: string) => void;
}

function CreateGroup({
  socket,
  selectTargetChatRoomHandler,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const createGroupError = useSelector(selectCreateGroupError);
  const newGroupToJoin = useSelector(selectNewGroupToJoin);
  const loadingStatus = useSelector(selectLoadingStatus_user);
  const [groupName, setGroupName] = useState<string>("");

  useEffect(() => {
    if (
      loadingStatus === loadingStatusEnum.createNewGroup_succeeded &&
      socket
    ) {
      dispatch(setLoadingStatus_user("idle"));
      createNewGroup_emitter(socket, { group_id: newGroupToJoin });
      selectTargetChatRoomHandler(newGroupToJoin, groupName, chatType.group);
    }
  }, [loadingStatus, newGroupToJoin]);

  function setGroupNameHandler(e: ChangeEvent<HTMLInputElement>) {
    setGroupName(e.target.value);
  }

  function createGroupHandler() {
    if (groupName === "") return;
    dispatch(
      createNewGroup({ group_name: groupName, admin_user_id: currentUserId })
    );
  }

  return (
    <main>
      <h3>I am the Create Group</h3>
      <div>
        <div>
          <label>group name</label>
          <input type="text" value={groupName} onChange={setGroupNameHandler} />
        </div>
      </div>
      <div>
        <button onClick={createGroupHandler} disabled={groupName === ""}>
          Create Group
        </button>
      </div>
      <div>{createGroupError}</div>
    </main>
  );
}

export default memo(CreateGroup);
