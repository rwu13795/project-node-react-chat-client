import { memo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

import { selectCurrentUser } from "../../../redux/user/userSlice";
import ChangeOnlineStatus from "./ChangeOnlineStatus";
import UserAvatar from "./UserAvatar";

// UI //
import styles from "./MainNavbar.module.css";
import { Stack, Avatar, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";

import logo from "../../../images/logo.svg";

interface Props {
  socket: Socket | undefined;
}

function MainNavbar({ socket }: Props): JSX.Element {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { username, user_id, onlineStatus, avatar_url, isLoggedIn } =
    useSelector(selectCurrentUser);

  function toUMainChat() {
    navigate("/chat");
  }

  return isLoggedIn ? (
    <main className={styles.main}>
      <div className={styles.left_grid}>
        <UserAvatar
          username={username}
          avatar_url={avatar_url}
          onlineStatus={onlineStatus}
          socket={socket}
        />
        <ChangeOnlineStatus
          socket={socket}
          onlineStatus={onlineStatus}
          username={username}
        />
        {pathname === "/profile" && (
          <button onClick={toUMainChat}>Back to Chat</button>
        )}
      </div>
      <div className={styles.right_grid}>
        <div className={styles.logo_wrapper}>
          <img src={logo} alt="logo" className={styles.logo} />
        </div>
        <div className={styles.title}>Reachat</div>
      </div>
    </main>
  ) : (
    <main className={styles.main_no_auth}>
      <div className={styles.title_no_auth}>Reachat</div>
      <img src={logo} alt="logo" className={styles.logo_no_auth} />
    </main>
  );
}

export default memo(MainNavbar);

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    width: "20px",
    height: "20px",
    // boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    // "&::after": {
    //   position: "absolute",
    //   top: 0,
    //   left: 0,
    //   width: "100%",
    //   height: "100%",
    //   borderRadius: "50%",
    //   // animation: "ripple 1.2s infinite ease-in-out",
    //   border: "1px solid currentColor",
    //   content: '""',
    // },
  },
  // "@keyframes ripple": {
  //   "0%": {
  //     transform: "scale(.8)",
  //     opacity: 1,
  //   },
  //   "100%": {
  //     transform: "scale(2.4)",
  //     opacity: 0,
  //   },
  // },
}));
