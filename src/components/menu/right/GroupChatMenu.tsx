import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { selectTargetChatRoom } from "../../../redux/message/messageSlice";
import {
  selectResult_groupInvitation,
  selectTargetGroup,
} from "../../../redux/user/userSlice";

import MembersList from "../../group/MembersList";
import RemoveGroup from "../../group/RemoveGroup";

interface Props {
  group_id: string;
  socket: Socket | undefined;
}

function GroupChatMenu({ group_id, socket }: Props): JSX.Element {
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(group_id));
  const result_invitation = useSelector(selectResult_groupInvitation);

  const [openMembersList, setOpenMembersList] = useState<boolean>(false);

  function openMembersListHandler() {
    setOpenMembersList((prev) => !prev);
  }

  return (
    <main>
      <h3>
        Chatting with {targetChatRoom.name}-{targetChatRoom.id}
      </h3>
      {targetGroup.user_left_at && (
        <div>
          You {targetGroup.was_kicked ? "were kicked out from" : "have left"}{" "}
          this group on {targetGroup.user_left_at}
        </div>
      )}
      <div>
        <button onClick={openMembersListHandler}>Members list</button>
        {openMembersList && <MembersList socket={socket} />}
        <RemoveGroup />
      </div>
      {result_invitation}
    </main>
  );
}

export default memo(GroupChatMenu);
