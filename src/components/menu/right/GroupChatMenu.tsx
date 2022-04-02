import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { selectTargetChatRoom } from "../../../redux/message/messageSlice";
import {
  selectResult_groupInvitation,
  selectTargetGroup,
} from "../../../redux/user/userSlice";
import LeaveGroup from "../../group/LeaveGroup";

import MembersList from "../../group/MembersList";
import RemoveGroup from "../../group/RemoveGroup";
import SelectFriendForGroup from "../../group/SelectFriendForGroup";

interface Props {
  target_id: string;
  socket: Socket | undefined;
  setOpenMemberList: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenFriendsForGroup: React.Dispatch<React.SetStateAction<boolean>>;
}

function GroupChatMenu({
  target_id,
  socket,
  setOpenMemberList,
  setOpenFriendsForGroup,
}: Props): JSX.Element {
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const {
    group_id,
    group_name,
    admin_user_id,
    user_left_at,
    was_kicked,
    user_left,
  } = useSelector(selectTargetGroup(target_id));
  const result_invitation = useSelector(selectResult_groupInvitation);

  useEffect(() => {
    setOpenFriendsForGroup(false);
    setOpenMemberList(false);
  }, [targetChatRoom]);

  function openMembersListHandler() {
    setOpenMemberList((prev) => !prev);
    setOpenFriendsForGroup(false);
  }

  function openFriendsForGroupHandler() {
    setOpenFriendsForGroup((prev) => !prev);
    setOpenMemberList(false);
  }

  return (
    <main>
      <div>
        Chatting with {targetChatRoom.name}-{targetChatRoom.id}
      </div>
      {user_left_at && (
        <div>
          You {was_kicked ? "were kicked out from" : "have left"} this group on{" "}
          {user_left_at}
        </div>
      )}
      <div>
        {user_left ? (
          <RemoveGroup />
        ) : (
          <>
            <button onClick={openMembersListHandler}>Members list</button>
            <button onClick={openFriendsForGroupHandler}>
              Invite friends to group
            </button>
            {/* {openMembersList && <MembersList socket={socket} />} */}
            <SelectFriendForGroup
              socket={socket}
              group_id={group_id}
              group_name={group_name}
              admin_user_id={admin_user_id}
            />
            <LeaveGroup
              socket={socket}
              group_id={group_id}
              group_name={group_name}
              admin_user_id={admin_user_id}
            />
          </>
        )}
      </div>
      {result_invitation}
    </main>
  );
}

export default memo(GroupChatMenu);
