import { memo } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { selectCurrentUser } from "../../redux/user/userSlice";
import ChangeOnlineStatus from "./ChangeOnlineStatus";

interface Props {
  socket: Socket | undefined;
}

function MainNavbar({ socket }: Props): JSX.Element {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <nav>
      <h1>I am the Navbar</h1>
      {currentUser.isLoggedIn && (
        <div>
          {" "}
          <div>
            User: {currentUser.username} @ ID {currentUser.user_id}
          </div>
          <div>Online-status: {currentUser.onlineStatus}</div>
          <ChangeOnlineStatus socket={socket} />
        </div>
      )}
    </nav>
  );
}

export default memo(MainNavbar);
