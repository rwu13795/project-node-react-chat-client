import { memo, useState } from "react";

// UI //
import styles from "./OptionsGroupChatMenu.module.css";
import styles_2 from "../top/UserAvatar.module.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button, Popover, Tooltip } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import LeaveGroup from "../../group/LeaveGroup";
import { Socket } from "socket.io-client";

interface Props {
  socket: Socket | undefined;
  group_id: string;
  group_name: string;
  admin_user_id: string;
  openMembersListHandler: () => void;
  openFriendForGroupHandler: () => void;
}

function OptionsGroupChatManu({
  socket,
  group_id,
  group_name,
  admin_user_id,
  openMembersListHandler,
  openFriendForGroupHandler,
}: Props): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);

  function openPopoverHandler(event: React.MouseEvent<HTMLDivElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }

  function toggleMemberList() {
    openMembersListHandler();
    handleClose();
  }
  function toggleInviteFriends() {
    openFriendForGroupHandler();
    handleClose();
  }

  return (
    <main className={styles.main}>
      <Tooltip title="More Options">
        <div className={styles.option_button} onClick={openPopoverHandler}>
          <MoreVertIcon />
        </div>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className={styles_2.popover_box}>
          <Button className={styles_2.button} onClick={toggleMemberList}>
            <GroupsIcon />
            Group Info
          </Button>
          <Button className={styles_2.button} onClick={toggleInviteFriends}>
            <GroupAddIcon />
            Invite Friends
          </Button>
          <Button className={styles_2.button}>
            <LeaveGroup
              socket={socket}
              group_id={group_id}
              group_name={group_name}
              admin_user_id={admin_user_id}
              isSmall={true}
              closePopover={handleClose}
            />
          </Button>
        </div>
      </Popover>
    </main>
  );
}

export default memo(OptionsGroupChatManu);
