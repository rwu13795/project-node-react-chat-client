import { Fragment, memo, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  chatType,
  selectMessageNotifications,
  selectGroupsPosition,
  Notifications,
} from "../../redux/message/messageSlice";
import { Group, selectGroupsList } from "../../redux/user/userSlice";
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

interface RenderGroup_props extends Props {
  group: Group;
  messageNotifications: Notifications;
}

function GroupsList({
  socket,
  selectTargetChatRoomHandler,
}: Props): JSX.Element {
  const groupsList = useSelector(selectGroupsList);
  const messageNotifications = useSelector(selectMessageNotifications);
  const groupsPosition = useSelector(selectGroupsPosition);

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
          <GroupInvitation socket={socket} />
          <List component="div" disablePadding>
            {groupsPosition.map((id) => {
              return (
                <RenderGroup
                  key={id}
                  socket={socket}
                  group={groupsList[id]}
                  messageNotifications={messageNotifications}
                  selectTargetChatRoomHandler={selectTargetChatRoomHandler}
                />
              );
            })}
          </List>
        </Collapse>
      </Fragment>
    </main>
  );
}

function RenderGroup({
  group,
  messageNotifications,
  socket,
  selectTargetChatRoomHandler,
}: RenderGroup_props): JSX.Element {
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

  if (group) {
    let {
      group_id,
      group_name,
      user_left,
      user_left_at,
      admin_user_id,
      was_kicked,
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
            groupOnClickHandler(group_id, group_name, user_left, user_left_at)
          }
        >
          {group_name} @ id:{group_id}
          {user_left
            ? was_kicked
              ? "---- You were kicked"
              : "---- You left the group"
            : ""}
        </button>
        <SelectFriendForGroup
          socket={socket}
          group_id={group_id}
          group_name={group_name}
          admin_user_id={admin_user_id}
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
  } else {
    return <h3>Loading ................</h3>;
  }
}

memo(RenderGroup);

export default memo(GroupsList);
