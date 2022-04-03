import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { selectTotalFriendNoteCount } from "../../../redux/message/messageSlice";
import { selectAddFriendRequests } from "../../../redux/user/userSlice";
import SearchUser from "../../friend/SearchUser";
import OnlineOfflineList from "./OnlineOfflineList";

// UI //
import styles from "./GroupsList.module.css";
import {
  Tooltip,
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
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import AddFriendRequest from "../../friend/AddFriendRequest";

interface Props {
  socket: Socket | undefined;
  selectTargetChatRoomHandler: (id: string, name: string, type: string) => void;
}

function FriendsList({
  socket,
  selectTargetChatRoomHandler,
}: Props): JSX.Element {
  const totalCount = useSelector(selectTotalFriendNoteCount);
  const addFriendRequests = useSelector(selectAddFriendRequests);

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
                  <Badge
                    badgeContent={
                      expand ? 0 : totalCount + addFriendRequests.length
                    }
                    color="info"
                  >
                    <div className={styles.list_item_text}>FRIENDS</div>
                  </Badge>
                </div>
              }
            />
          </ListItemButton>
          <Tooltip title="Add friend">
            <AddCircleOutlineIcon
              className={styles.plus_button}
              onClick={handleOpenModal}
            />
          </Tooltip>
        </div>
        {!expand && <div className={styles.list_item_border_hover}></div>}
        <div className={expand ? styles.list_item_border : ""}></div>
      </div>

      <Collapse in={expand} timeout="auto" unmountOnExit>
        {addFriendRequests.length > 0 && <AddFriendRequest socket={socket} />}
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
            <div className={styles.close_icon_wrapper}>
              <CancelPresentationIcon
                className={styles.close_icon}
                onClick={handleCloseModal}
              />
            </div>
            <SearchUser socket={socket} />
          </Box>
        </Fade>
      </Modal>
    </main>
  );
}

export default memo(FriendsList);
