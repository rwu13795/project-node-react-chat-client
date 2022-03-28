import { Fragment, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  chatType,
  selectGroupNotifications,
  selectGroupsPosition,
  Notifications,
  selectTargetChatRoom,
  selectTotalGroupNoteCount,
} from "../../../redux/message/messageSlice";
import {
  clearRequestError,
  Group,
  selectGroupInvitations,
  selectGroupsList,
} from "../../../redux/user/userSlice";
import CreateGroup from "../../group/CreateGroup";
import SelectFriendForGroup from "../../group/SelectFriendForGroup";
import GroupInvitation from "../../group/GroupInvitation";
import RenderGroup from "./RenderGroup";

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
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

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
  const dispatch = useDispatch();

  const groupsList = useSelector(selectGroupsList);
  const groupNotifications = useSelector(selectGroupNotifications);
  const groupsPosition = useSelector(selectGroupsPosition);
  const { type, id: target_id } = useSelector(selectTargetChatRoom);
  const totalCount = useSelector(selectTotalGroupNoteCount);
  const groupInvitations = useSelector(selectGroupInvitations);

  const [expand, setExpand] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  function toggleExpand() {
    setExpand(!expand);
  }
  function handleOpenModal() {
    setOpenModal(true);
  }
  function handleCloseModal() {
    dispatch(clearRequestError("all"));
    setOpenModal(false);
  }

  console.log(totalCount);

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
                      expand ? 0 : totalCount + groupInvitations.length
                    }
                    color="info"
                  >
                    <div className={styles.list_item_text}>GROUPS</div>
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
        {!expand && <div className={styles.list_item_border_hover}></div>}
        <div className={expand ? styles.list_item_border : ""}></div>
      </div>

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
            <CreateGroup
              socket={socket}
              selectTargetChatRoomHandler={selectTargetChatRoomHandler}
              handleCloseModal={handleCloseModal}
            />
          </Box>
        </Fade>
      </Modal>

      <Collapse in={expand} timeout="auto" unmountOnExit>
        {groupInvitations.length > 0 && (
          <GroupInvitation
            groupInvitations={groupInvitations}
            socket={socket}
          />
        )}
        {groupsPosition.length > 0 ? (
          <List component="div" disablePadding className={styles.group_list}>
            {groupsPosition.map((id) => {
              let room_id = `${chatType.group}_${id}`;
              let count = 0;
              if (groupNotifications[room_id]) {
                count = groupNotifications[room_id].count;
              }
              return (
                <RenderGroup
                  key={id}
                  socket={socket}
                  target_room={`${type}_${target_id}`}
                  group={groupsList[id]}
                  notificationCount={count}
                  selectTargetChatRoomHandler={selectTargetChatRoomHandler}
                />
              );
            })}
          </List>
        ) : (
          <div className={styles.no_group_wrapper}>
            <div>You are not in any group</div>
            <Button
              variant="outlined"
              onClick={handleOpenModal}
              className={styles.create_button}
            >
              Create a new group
            </Button>
          </div>
        )}
      </Collapse>
    </main>
  );
}

export default memo(GroupsList);
