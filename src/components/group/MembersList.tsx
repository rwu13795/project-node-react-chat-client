import { memo } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { selectTargetChatRoom } from "../../redux/message/messageSlice";
import { selectTargetGroup, selectUserId } from "../../redux/user/userSlice";
import KickMember from "./KickMember";

interface Props {
  socket: Socket | undefined;
}

function MembersList({ socket }: Props): JSX.Element {
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));
  const currentUserId = useSelector(selectUserId);

  return (
    <main>
      {targetGroup &&
        targetGroup.group_members &&
        !targetGroup.user_left &&
        targetGroup.group_members.map((member, index) => {
          return (
            <div key={index}>
              Username: {member.username} @ID{member.user_id}
              {targetGroup.admin_user_id === member.user_id && (
                <span style={{ color: "red" }}>Group Admin</span>
              )}
              {currentUserId === targetGroup.admin_user_id && (
                <KickMember
                  socket={socket}
                  group_id={targetGroup.group_id}
                  member_user_id={member.user_id}
                  member_username={member.username}
                  currentUserId={currentUserId}
                />
              )}
            </div>
          );
        })}
    </main>
  );
}

export default memo(MembersList);
