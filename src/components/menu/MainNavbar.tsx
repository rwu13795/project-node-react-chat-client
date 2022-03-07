import { memo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { selectCurrentUser } from "../../redux/user/userSlice";
import ChangeOnlineStatus from "./ChangeOnlineStatus";

interface Props {
  socket: Socket | undefined;
}

function MainNavbar({ socket }: Props): JSX.Element {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentUser = useSelector(selectCurrentUser);

  function toUserProfile() {
    navigate("/profile");
  }
  function toUMainChat() {
    navigate("/chat");
  }

  return (
    <main>
      {currentUser.isLoggedIn && (
        <div>
          {" "}
          <div>
            User: {currentUser.username} @ ID {currentUser.user_id}
          </div>
          <div>Online-status: {currentUser.onlineStatus}</div>
          <ChangeOnlineStatus socket={socket} />
          {pathname === "/profile" && (
            <button onClick={toUMainChat}>Back to Chat</button>
          )}
          {pathname === "/chat" && (
            <button onClick={toUserProfile}>User Profile</button>
          )}
        </div>
      )}
    </main>
  );
}

export default memo(MainNavbar);
