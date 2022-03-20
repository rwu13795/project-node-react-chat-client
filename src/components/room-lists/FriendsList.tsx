import { Fragment, memo, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  chatType,
  selectFriendsPosition,
  selectMessageNotifications,
} from "../../redux/message/messageSlice";
import { selectFriendsList } from "../../redux/user/userSlice";
import SearchUser from "../friend/SearchUser";

// UI //
import styles from "./RoomLists.module.css";
import AddFriendRequest from "../friend/AddFriendRequest";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Collapse,
  Fade,
  List,
  ListItemButton,
  ListItemText,
  Modal,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface Props {
  socket: Socket | undefined;
  selectTargetChatRoomHandler: (id: string, name: string, type: string) => void;
}

function FriendsList({
  socket,
  selectTargetChatRoomHandler,
}: Props): JSX.Element {
  const friendsList = useSelector(selectFriendsList);
  const friendsPosition = useSelector(selectFriendsPosition);
  const messageNotifications = useSelector(selectMessageNotifications);

  const [expand, setExpand] = useState<boolean>(false);
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
      <Fragment>
        <div className={styles.drawer}>
          <ListItemButton
            onClick={toggleExpand}
            sx={{ pl: 2, height: "100px" }}
          >
            {expand ? <ExpandLess /> : <ExpandMore />}
            <ListItemText
              primary={
                <div
                  style={{
                    color: "green",
                    fontSize: "3rem",
                    textAlign: "center",
                  }}
                >
                  Friends
                </div>
              }
            />
          </ListItemButton>
          <AddCircleOutlineIcon
            className={styles.plus_button}
            onClick={handleOpenModal}
          />
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
          <AddFriendRequest socket={socket} />
          <List component="div" disablePadding>
            {friendsPosition.map((id) => {
              if (friendsList[id]) {
                let { friend_id, friend_username, onlineStatus } =
                  friendsList[id];
                let target_id = `${chatType.private}_${friend_id}`;
                let count = 0;
                if (messageNotifications[target_id]) {
                  count = messageNotifications[target_id].count;
                }
                return (
                  <div key={friend_id}>
                    <button
                      onClick={() =>
                        selectTargetChatRoomHandler(
                          friend_id,
                          friend_username,
                          chatType.private
                        )
                      }
                    >
                      {friend_username + "@ID" + friend_id}
                    </button>
                    <div>notifications: {count}</div>
                    <div>
                      friend {friend_username} online-status: {onlineStatus}
                    </div>

                    <hr />
                  </div>
                );
              } else {
                return <h3>loading.....</h3>;
              }
            })}
          </List>
        </Collapse>
      </Fragment>
    </main>
  );
}

export default memo(FriendsList);
