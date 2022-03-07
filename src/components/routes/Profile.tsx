import { memo } from "react";
import { useSelector } from "react-redux";

import { selectCurrentUser } from "../../redux/user/userSlice";
import AddAvatar from "../user/AddAvatar";

function UserProfile(): JSX.Element {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <main>
      <h1>UserProfile</h1>
      <div>Username: {currentUser.username}</div>
      <div>User ID: {currentUser.user_id}</div>
      <div>User Email: {currentUser.email}</div>
      <div>Avatar: {currentUser.avatar_url}</div>
      <AddAvatar />
    </main>
  );
}

export default memo(UserProfile);
