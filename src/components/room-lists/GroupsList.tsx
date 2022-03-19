import { Fragment, memo, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  chatType,
  selectMessageNotifications,
} from "../../redux/message/messageSlice";
import {
  selectGroupInvitations,
  selectGroupsList,
  selectUserId,
} from "../../redux/user/userSlice";
import CreateGroup from "../group/CreateGroup";
import SelectFriendForGroup from "../group/SelectFriendForGroup";
import GroupInvitation from "../group/GroupInvitaion";
import LeaveGroup from "../group/LeaveGroup";

// UI //
import styles from "./RoomLists.module.css";
import {
  Button,
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

interface Props {
  socket: Socket | undefined;
  selectTargetChatRoomHandler: (
    id: string,
    name: string,
    type: string,
    date_limit?: string | null
  ) => void;
}

function GroupsList({
  socket,
  selectTargetChatRoomHandler,
}: Props): JSX.Element {
  const groupsList = useSelector(selectGroupsList);
  const messageNotifications = useSelector(selectMessageNotifications);
  const currentUserId = useSelector(selectUserId);
  const groupInvitations = useSelector(selectGroupInvitations);

  const [expand, setExpand] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  function groupOnClickHandler(
    group_id: string,
    group_name: string,
    user_left: boolean,
    user_left_at: string | null
  ) {
    if (user_left) {
      window.alert("you were politely kicked out of this group by the creator");
    }
    selectTargetChatRoomHandler(
      group_id,
      group_name,
      chatType.group,
      user_left_at
    );
  }

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
                  Groups
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
                <CreateGroup
                  socket={socket}
                  selectTargetChatRoomHandler={selectTargetChatRoomHandler}
                />
              </Box>
            </Fade>
          </Modal>
        </div>

        <Collapse in={expand} timeout="auto" unmountOnExit>
          <GroupInvitation
            socket={socket}
            selectTargetChatRoomHandler={selectTargetChatRoomHandler}
          />
          <List component="div" disablePadding>
            {Object.values(groupsList).map((group) => {
              // choose which friend to send message
              // pass the friend_id inside the message body, and the server
              // will emit the messsage to the room where the friend is in
              let {
                group_id,
                group_name,
                user_left,
                user_left_at,
                admin_user_id,
              } = group;
              let room_id = `${chatType.group}_${group_id}`;
              let count = 0;
              if (messageNotifications[room_id]) {
                count = messageNotifications[room_id].count;
              }

              return (
                <div key={group_id}>
                  <button
                    id={`${chatType.group}_${group_id}`}
                    onClick={() =>
                      groupOnClickHandler(
                        group_id,
                        group_name,
                        user_left,
                        user_left_at
                      )
                    }
                  >
                    {group_name} @ id:{group_id}
                    {group.user_left
                      ? group.was_kicked
                        ? "---- You were kicked"
                        : "---- You left the group"
                      : ""}
                  </button>
                  <SelectFriendForGroup
                    socket={socket}
                    group_id={group_id}
                    group_name={group_name}
                  />
                  <div>notifications: {count}</div>
                  <LeaveGroup
                    socket={socket}
                    group_id={group_id}
                    group_name={group_name}
                    admin_user_id={admin_user_id}
                  />
                </div>
              );
            })}
          </List>
        </Collapse>
      </Fragment>
    </main>
  );
}

export default memo(GroupsList);
