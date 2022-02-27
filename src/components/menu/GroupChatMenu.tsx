import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import {
  selectTargetFriend,
  selectTargetGroup,
  setBlockFriend,
} from "../../redux/user/userSlice";
import BlockFriend from "../friend/BlockFriend";
import DeleteFriend from "../friend/DeleteFriend";
import UnblockFriend from "../friend/UnblockFriend";
import MembersList from "../group/MembersList";
import RemoveGroup from "../group/RemoveGroup";

interface Props {
  group_id: string;
  socket: Socket | undefined;
}

function GroupChatMenu({ group_id, socket }: Props): JSX.Element {
  const targetGroup = useSelector(selectTargetGroup(group_id));

  const [openMembersList, setOpenMembersList] = useState<boolean>(false);

  function openMembersListHandler() {
    setOpenMembersList((prev) => !prev);
  }

  return (
    <main>
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
    </main>
  );
}

export default memo(GroupChatMenu);
