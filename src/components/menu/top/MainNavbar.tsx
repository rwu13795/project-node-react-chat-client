import { memo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

import { selectCurrentUser } from "../../../redux/user/userSlice";
import ChangeOnlineStatus from "./ChangeOnlineStatus";
import UserAvatar from "./UserAvatar";

// UI //
import styles from "./MainNavbar.module.css";
import { Badge, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";

import logo from "../../../images/logo.svg";
import { scrollToTop } from "../../../utils";

interface Props {
  socket: Socket | undefined;
}

function MainNavbar({ socket }: Props): JSX.Element {
  const navigate = useNavigate();

  const { username, onlineStatus, avatar_url, isLoggedIn } =
    useSelector(selectCurrentUser);

  function backToHomePage() {
    scrollToTop();
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
      </div>
      <Tooltip title="Home Page">
        <div className={styles.right_grid} onClick={backToHomePage}>
          <div className={styles.logo_wrapper}>
            <img src={logo} alt="logo" className={styles.logo} />
          </div>
          <div className={styles.title}>Reachat</div>
        </div>
      </Tooltip>
    </main>
  ) : (
    <main className={styles.main_no_auth}>
      <div className={styles.title_no_auth}>Reachat</div>
      <img src={logo} alt="logo" className={styles.logo_no_auth} />
    </main>
  );
}

export default memo(MainNavbar);
