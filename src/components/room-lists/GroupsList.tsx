import { memo } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  chatType,
  selectMessageNotifications,
} from "../../redux/message/messageSlice";
import {
  selectGroupInvitations,
  selectGroupsObjectList,
  selectUserId,
} from "../../redux/user/userSlice";
import CreateGroup from "../group/CreateGroup";
import InviteFriendToGroup from "../group/InviteFriendToGroup";
import GroupInvitation from "../group/GroupInvitaion";
import LeaveGroup from "../group/LeaveGroup";

interface Props {
  socket: Socket | undefined;
  selectTargetChatRoomHandler: (id: string, name: string, type: string) => void;
}

function GroupsList({
  socket,
  selectTargetChatRoomHandler,
}: Props): JSX.Element {
  const groupsObjectList = useSelector(selectGroupsObjectList);
  const messageNotifications = useSelector(selectMessageNotifications);
  const currentUserId = useSelector(selectUserId);
  const groupInvitations = useSelector(selectGroupInvitations);

  function groupOnClickHandler(
    group_id: string,
    group_name: string,
    user_kicked: boolean
  ) {
    if (user_kicked) {
      window.alert("you were politely kicked out of this group by the creator");
      return;
    }

    selectTargetChatRoomHandler(group_id, group_name, chatType.group);
  }

  return (
    <main>
      <h3>GroupsList</h3>
      <div>
        <CreateGroup />
        <hr />
        <GroupInvitation socket={socket} />
      </div>
      <div>
        {Object.values(groupsObjectList).map((group) => {
          // choose which friend to send message
          // pass the friend_id inside the message body, and the server
          // will emit the messsage to the room where the friend is in
          let { group_id, group_name, creator_user_id, user_kicked } = group;
          return (
            <div key={group_id}>
              <button
                onClick={() =>
                  groupOnClickHandler(group_id, group_name, user_kicked)
                }
              >
                {group_name + group_id}
              </button>
              <InviteFriendToGroup
                socket={socket}
                group_id={group_id}
                group_name={group_name}
              />
              <div>
                notifications:{" "}
                {messageNotifications[`${chatType.group}_${group_id}`]}{" "}
              </div>
              <LeaveGroup
                socket={socket}
                group_id={group_id}
                group_name={group_name}
              />
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default memo(GroupsList);
