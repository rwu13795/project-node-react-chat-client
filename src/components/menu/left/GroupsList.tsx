import { Fragment, memo, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  chatType,
  selectMessageNotifications,
  selectGroupsPosition,
  Notifications,
  selectTargetChatRoom,
  selectTotalGroupNoteCount,
} from "../../../redux/message/messageSlice";
import { Group, selectGroupsList } from "../../../redux/user/userSlice";
import CreateGroup from "../../group/CreateGroup";
import SelectFriendForGroup from "../../group/SelectFriendForGroup";
import GroupInvitation from "../../group/GroupInvitaion";
import LeaveGroup from "../../group/LeaveGroup";

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
import RenderGroup from "./RenderGroup";

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
  const groupsPosition = useSelector(selectGroupsPosition);
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const totalCount = useSelector(selectTotalGroupNoteCount);

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

  console.log(totalCount);

  return (
    <main>
      <div className={styles.drawer}>
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
                  <div className={styles.list_item_text}>GROUPS</div>
                </Badge>
                <div className={expand ? styles.list_item_border : ""}></div>
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
        <GroupInvitation socket={socket} />
        <List component="div" disablePadding className={styles.group_list}>
          {groupsPosition.map((id) => {
            let room_id = `${chatType.group}_${id}`;
            let count = 0;
            if (messageNotifications[room_id]) {
              count = messageNotifications[room_id].count;
            }
            return (
              <RenderGroup
                key={id}
                socket={socket}
                target_id={targetChatRoom.id}
                group={groupsList[id]}
                notificationCount={count}
                selectTargetChatRoomHandler={selectTargetChatRoomHandler}
              />
            );
          })}
        </List>
      </Collapse>
    </main>
  );
}

export default memo(GroupsList);
