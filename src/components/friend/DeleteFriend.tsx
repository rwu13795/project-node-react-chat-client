import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

interface Props {
  friend_id: string;
}

function DeleteFriend({ friend_id }: Props): JSX.Element {
  function deleteFriendHandler() {
    // dispatch(setDeleteFriend({ friend_id, block: true }));

    console.log("deleted friend @", friend_id);
  }

  return (
    <main>
      <button onClick={deleteFriendHandler}>delete friend</button>
    </main>
  );
}

export default memo(DeleteFriend);
