import { memo } from "react";
import { useSelector } from "react-redux";

import {
  chatType,
  selectMessageNotifications,
} from "../../redux/message/messageSlice";
import {
  selectFriendsList,
  selectFriendsOnlineStatus,
} from "../../redux/user/userSlice";

interface Props {
  selectTargetChatRoomHandler: (id: string, name: string, type: string) => void;
}

function FriendsList({ selectTargetChatRoomHandler }: Props): JSX.Element {
  const friendsList = useSelector(selectFriendsList);
  const messageNotifications = useSelector(selectMessageNotifications);
  const friendsOnlineStatus = useSelector(selectFriendsOnlineStatus);

  return (
    <main>
      <h3>FriendsList</h3>
      <div>
        {friendsList.map((friend) => {
          // choose which friend to send message
          // pass the friend_id inside the message body, and the server
          // will emit the messsage to the room where the friend is in
          let { friend_id, friend_username } = friend;
          return (
            <div key={friend.friend_id}>
              <button
                onClick={() =>
                  selectTargetChatRoomHandler(
                    friend_id,
                    friend_username,
                    chatType.private
                  )
                }
              >
                {friend.friend_username + friend.friend_id}
              </button>
              <div>
                notifications:{" "}
                {messageNotifications[`${chatType.private}_${friend_id}`]}{" "}
              </div>
              <div>
                friend {friend_username} is online:{" "}
                {friendsOnlineStatus[friend_id] ? "yes" : "no"}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default memo(FriendsList);
