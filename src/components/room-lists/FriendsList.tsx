import { memo } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  chatType,
  selectMessageNotifications,
} from "../../redux/message/messageSlice";
import { selectFriendsList } from "../../redux/user/userSlice";
import AddFriendRequest from "../friend/AddFriendRequest";

interface Props {
  socket: Socket | undefined;
  selectTargetChatRoomHandler: (id: string, name: string, type: string) => void;
}

function FriendsList({
  socket,
  selectTargetChatRoomHandler,
}: Props): JSX.Element {
  const friendsList = useSelector(selectFriendsList);
  const messageNotifications = useSelector(selectMessageNotifications);

  return (
    <main>
      <h3>FriendsList</h3>
      <div>
        {Object.values(friendsList).map((friend) => {
          // choose which friend to send message
          // pass the friend_id inside the message body, and the server
          // will emit the messsage to the room where the friend is in
          let { friend_id, friend_username } = friend;
          return (
            <div key={friend_id}>
              <button
                onClick={() =>
                  selectTargetChatRoomHandler(
                    friend_id,
                    friend_username,
                    chatType.private
                  )
                }
              >
                {friend_username + friend_id}
              </button>
              <div>
                notifications:{" "}
                {messageNotifications[`${chatType.private}_${friend_id}`]}{" "}
              </div>
              <div>
                friend {friend_username} online-status:{" "}
                {friendsList[friend_id].onlineStatus}
              </div>

              <hr />
            </div>
          );
        })}
      </div>

      <hr />
      <AddFriendRequest socket={socket} />
    </main>
  );
}

export default memo(FriendsList);
