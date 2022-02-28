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
    <main>
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
    </main>
  );
}

export default memo(MainNavbar);
