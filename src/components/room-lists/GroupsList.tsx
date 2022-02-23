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
  selectTargetChatRoomHandler: (
    id: string,
    name: string,
    type: string,
    date_limit?: string | null
  ) => void;
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
    user_left: boolean,
    user_left_at: string | null
  ) {
    if (user_left) {
      window.alert("you were politely kicked out of this group by the creator");
    }

    selectTargetChatRoomHandler(
      group_id,
      group_name,
      chatType.group,
      user_left_at
    );
  }

  return (
    <main>
      <h3>GroupsList</h3>
      <div>
        <CreateGroup
          socket={socket}
          selectTargetChatRoomHandler={selectTargetChatRoomHandler}
        />
        <hr />
        <GroupInvitation
          socket={socket}
          selectTargetChatRoomHandler={selectTargetChatRoomHandler}
        />
      </div>
      <div>
        {Object.values(groupsObjectList).map((group) => {
          // choose which friend to send message
          // pass the friend_id inside the message body, and the server
          // will emit the messsage to the room where the friend is in
          let {
            group_id,
            group_name,
            creator_user_id,
            user_left,
            user_left_at,
          } = group;
          return (
            <div key={group_id}>
              <button
                id={`${chatType.group}_${group_id}`}
                onClick={() =>
                  groupOnClickHandler(
                    group_id,
                    group_name,
                    user_left,
                    user_left_at
                  )
                }
              >
                {group_name} @ id:{group_id}
                {group.user_left
                  ? group.was_kicked
                    ? "---- You were kicked"
                    : "---- You left the group"
                  : ""}
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
