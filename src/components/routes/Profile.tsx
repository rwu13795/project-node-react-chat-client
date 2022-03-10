import { memo } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { selectCurrentUser } from "../../redux/user/userSlice";
import AddAvatar from "../user/AddAvatar";

interface Props {
  socket: Socket | undefined;
}

function UserProfile({ socket }: Props): JSX.Element {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <main>
      <h1>UserProfile</h1>
      <div>Username: {currentUser.username}</div>
      <div>User ID: {currentUser.user_id}</div>
      <div>User Email: {currentUser.email}</div>
      <div>
        Avatar: <img src={currentUser.avatar_url} alt="user_avatar"></img>
      </div>
      <AddAvatar socket={socket} />
    </main>
  );
}

export default memo(UserProfile);
