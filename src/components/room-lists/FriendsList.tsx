import { Fragment, memo, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  chatType,
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
            {Object.values(friendsList).map((friend) => {
              // choose which friend to send message
              // pass the friend_id inside the message body, and the server
              // will emit the messsage to the room where the friend is in
              let { friend_id, friend_username } = friend;
              let room_id = `${chatType.private}_${friend_id}`;
              let count = 0;
              if (messageNotifications[room_id]) {
                count = messageNotifications[room_id].count;
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
                    {friend_username + friend_id}
                  </button>
                  <div>notifications: {count}</div>
                  <div>
                    friend {friend_username} online-status:{" "}
                    {friendsList[friend_id].onlineStatus}
                  </div>

                  <hr />
                </div>
              );
            })}
          </List>
        </Collapse>
      </Fragment>
    </main>
  );
}

export default memo(FriendsList);
