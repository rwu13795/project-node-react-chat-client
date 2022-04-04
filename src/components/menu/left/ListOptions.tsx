import { memo, useState } from "react";

// UI //
import styles from "./ListOptions.module.css";
import styles_2 from "../top/UserAvatar.module.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button, Popover, Tooltip } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AddCircleIcon from "@mui/icons-material/AddCircle";

interface Props {
  openModal_1: () => void;
  openModal_2: () => void;
  forFriendsList: boolean;
}

function ListOptions({
  openModal_1,
  openModal_2,
  forFriendsList,
}: Props): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);

  function openPopoverHandler(event: React.MouseEvent<HTMLDivElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }
  function openModal_1_handler() {
    handleClose();
    openModal_1();
  }
  function openModal_2_handler() {
    handleClose();
    openModal_2();
  }

  return (
    <main className={styles.main}>
      <Tooltip title="Options">
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
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className={styles_2.popover_box}>
          <Button className={styles_2.button} onClick={openModal_1_handler}>
            {forFriendsList ? (
              <>
                <GroupAddIcon /> Add Friend
              </>
            ) : (
              <>
                <AddCircleIcon /> Create Group
              </>
            )}
          </Button>
          <Button className={styles_2.button} onClick={openModal_2_handler}>
            <PersonSearchIcon />{" "}
            {forFriendsList ? "Filter Friends" : "Filter Groups"}
          </Button>
        </div>
      </Popover>
    </main>
  );
}

export default memo(ListOptions);
