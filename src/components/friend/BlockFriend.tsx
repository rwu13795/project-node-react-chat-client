import { memo } from "react";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";
import { setBlockFriend } from "../../redux/user/userSlice";

interface Props {
  friend_id: string;
  socket: Socket | undefined;
}

function BlockFriend({ socket, friend_id }: Props): JSX.Element {
  const dispatch = useDispatch();

  function blockFriendHandler() {
    if (socket) {
      socket.emit("block-friend", { friend_id, block: true });
    }
    dispatch(setBlockFriend({ friend_id, block: true, being_blocked: false }));
  }

  return (
    <main>
      <button onClick={blockFriendHandler}>block friend</button>
    </main>
  );
}

export default memo(BlockFriend);
