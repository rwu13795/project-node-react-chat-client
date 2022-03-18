import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { clearLeftMember, selectUsername } from "../../redux/user/userSlice";
import { kickMember_emitter } from "../../socket-io/emitters";

interface Props {
  socket: Socket | undefined;
  group_id: string;
  member_user_id: string;
  member_username: string;
  currentUserId: string;
}

function KickMember({
  socket,
  group_id,
  member_user_id,
  member_username,
  currentUserId,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const currentUsername = useSelector(selectUsername);

  function kickMemberHandler() {
    if (socket)
      kickMember_emitter({ socket, group_id, member_user_id, member_username });

    dispatch(clearLeftMember({ group_id, member_user_id }));

    console.log("kicked user", member_user_id, member_username);
  }

  return (
    <main>
      <div>
        {currentUserId !== member_user_id && (
          <button onClick={kickMemberHandler}>Kick member</button>
        )}
      </div>
    </main>
  );
}

export default memo(KickMember);
