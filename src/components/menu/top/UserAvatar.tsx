import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useDispatch } from "react-redux";

import { signOut } from "../../../redux/user/asyncThunk";
import StatusDot from "./StatusDot";

// UI //
import styles from "./UserAvatar.module.css";
import { Avatar, Button, Popover } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import LogoutIcon from "@mui/icons-material/Logout";
import { setIsLoggedIn } from "../../../redux/user/userSlice";
import { logout_emitter } from "../../../socket-io/emitters";

interface Props {
  username: string;
  avatar_url: string | undefined;
  onlineStatus: string;
  socket: Socket | undefined;
}

function UserAvatar({
  username,
  avatar_url,
  onlineStatus,
  socket,
}: Props): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);

  function openListHandler(event: React.MouseEvent<HTMLDivElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }

  function toUserProfile() {
    navigate("/profile");
    handleClose();
  }
  function logoutHandler() {
    handleClose();
    if (socket) {
      logout_emitter(socket);
    }
    dispatch(signOut());
    dispatch(setIsLoggedIn(false));
    navigate("/");
  }

  return (
    <main className={styles.main}>
      <div onClick={openListHandler} className={styles.avatar_wrapper}>
        <Avatar src={avatar_url} alt={username[0]} className={styles.avatar} />
      </div>
      <StatusDot onlineStatus={onlineStatus} forAvatar={true} />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className={styles.popover_box}>
          <Button onClick={toUserProfile} className={styles.button}>
            <FaceIcon /> User Profile
          </Button>
          <Button onClick={logoutHandler} className={styles.button}>
            <LogoutIcon /> Log out
          </Button>
        </div>
      </Popover>
    </main>
  );
}

export default memo(UserAvatar);
