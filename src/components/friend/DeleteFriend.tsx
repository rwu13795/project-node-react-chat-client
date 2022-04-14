import { memo } from "react";

interface Props {
  friend_id: string;
}

function DeleteFriend({ friend_id }: Props): JSX.Element {
  function deleteFriendHandler() {
    console.log("deleted friend @", friend_id);
  }

  return (
    <main>
      <button onClick={deleteFriendHandler}>delete friend</button>
    </main>
  );
}

export default memo(DeleteFriend);
