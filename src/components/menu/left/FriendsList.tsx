import { Fragment, memo, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  chatType,
  selectFriendsPosition,
  selectFriendNotifications,
  selectTargetChatRoom,
  selectTotalFriendNoteCount,
} from "../../../redux/message/messageSlice";
import {
  onlineStatus_enum,
  selectFriendsList,
} from "../../../redux/user/userSlice";
import SearchUser from "../../friend/SearchUser";
import OnlineOfflineList from "./OnlineOfflineList";

// UI //
import styles from "./GroupsList.module.css";
import {
  Button,
  Badge,
  Collapse,
  Fade,
  List,
  ListItemButton,
  ListItemText,
  Modal,
  Backdrop,
  Box,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddFriendRequest from "../../friend/AddFriendRequest";
import RenderFriend from "./RenderFriend";

interface Props {
  socket: Socket | undefined;
  selectTargetChatRoomHandler: (id: string, name: string, type: string) => void;
}

function FriendsList({
  socket,
  selectTargetChatRoomHandler,
}: Props): JSX.Element {
  const totalCount = useSelector(selectTotalFriendNoteCount);

  const [expand, setExpand] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);

  function toggleExpand() {
    setExpand(!expand);
  }
  function handleOpenModal() {
    setOpenModal(true);
  }
  function handleCloseModal() {
    setOpenModal(false);
  }

  return (
    <main>
      <div className={styles.drawer}>
        <div className={styles.drawer_item_upper}>
          <ListItemButton
            onClick={toggleExpand}
            className={styles.list_item_button}
          >
            {expand ? (
              <ExpandLess className={styles.arrow_up} />
            ) : (
              <ExpandMore className={styles.arrow_down} />
            )}
            <ListItemText
              primary={
                <div className={styles.list_item_text_wrapper}>
                  <Badge badgeContent={expand ? 0 : totalCount} color="info">
                    <div className={styles.list_item_text}>FRIENDS</div>
                  </Badge>
                </div>
              }
            />
          </ListItemButton>
          <AddCircleOutlineIcon
            className={styles.plus_button}
            onClick={handleOpenModal}
          />
        </div>
        <div className={expand ? styles.list_item_border : ""}></div>
        <Modal
          disableScrollLock={true}
          open={openModal}
          onClose={handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <Box className={styles.modal}>
              <SearchUser socket={socket} />
            </Box>
          </Fade>
        </Modal>
      </div>

      <Collapse in={expand} timeout="auto" unmountOnExit>
        {/* <AddFriendRequest socket={socket} /> */}
        <List component="div" disablePadding className={styles.group_list}>
          <OnlineOfflineList
            selectTargetChatRoomHandler={selectTargetChatRoomHandler}
            socket={socket}
            isOnline={true}
          />
          <OnlineOfflineList
            selectTargetChatRoomHandler={selectTargetChatRoomHandler}
            socket={socket}
            isOnline={false}
          />
        </List>
      </Collapse>
    </main>
  );
}

export default memo(FriendsList);
