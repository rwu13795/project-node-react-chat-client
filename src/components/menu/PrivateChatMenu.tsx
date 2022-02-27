import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { selectTargetFriend, setBlockFriend } from "../../redux/user/userSlice";
import BlockFriend from "../friend/BlockFriend";
import DeleteFriend from "../friend/DeleteFriend";
import UnblockFriend from "../friend/UnblockFriend";

interface Props {
  friend_id: string;
  socket: Socket | undefined;
}

function PrivateChatMenu({ friend_id, socket }: Props): JSX.Element {
  const targetFriend = useSelector(selectTargetFriend(friend_id));

  return (
    <main>
      {targetFriend.user_blocked_friend ? (
        <div>
          <div style={{ color: "red" }}>
            This friend was blocked on {targetFriend.user_blocked_friend_at}
          </div>
          <UnblockFriend friend_id={friend_id} socket={socket} />
          <DeleteFriend friend_id={friend_id} />
        </div>
      ) : (
        <BlockFriend friend_id={friend_id} socket={socket} />
      )}
      {targetFriend.friend_blocked_user && (
        <div style={{ color: "red" }}>
          You were block by this friend, you cannot send him/her any message
          untill you are unblocked!
        </div>
      )}
    </main>
  );
}

export default memo(PrivateChatMenu);
