import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  chatType,
  selectGroupNotifications,
  selectGroupsPosition,
  selectTargetChatRoom,
  selectTotalGroupNoteCount,
} from "../../../redux/message/messageSlice";
import {
  clearRequestError,
  selectGroupInvitations,
  selectGroupsList,
} from "../../../redux/user/userSlice";
import CreateGroup from "../../group/CreateGroup";
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
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import ListOptions from "./ListOptions";
import FilterGroups from "../../group/FilterGroups";

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
  const [createGroup, setCreateGroup] = useState<boolean>(false);
  const [filterGroup, setFilterGroup] = useState<boolean>(false);

  function toggleExpand() {
    setExpand(!expand);
  }
  function openCreateGroup() {
    setCreateGroup(true);
  }
  function closeCreateGroup() {
    dispatch(clearRequestError("all"));
    setCreateGroup(false);
  }
  function openFilterGroup() {
    setFilterGroup(true);
  }
  function closeFilterGroup() {
    setFilterGroup(false);
  }

  return (
    <main className={styles.main}>
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

          <ListOptions
            openModal_1={openCreateGroup}
            openModal_2={openFilterGroup}
            forFriendsList={false}
          />
        </div>
        {!expand && <div className={styles.list_item_border_hover}></div>}
        <div className={expand ? styles.list_item_border : ""}></div>
      </div>

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
              onClick={openCreateGroup}
              className={styles.create_button}
            >
              Create a new group
            </Button>
          </div>
        )}
      </Collapse>

      {/* Create Group Modal */}
      <Modal
        disableScrollLock={true}
        open={createGroup}
        onClose={closeCreateGroup}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={createGroup}>
          <Box className={styles.modal}>
            <div className={styles.close_icon_wrapper}>
              <CancelPresentationIcon
                className={styles.close_icon}
                onClick={closeCreateGroup}
              />
            </div>
            <CreateGroup
              socket={socket}
              selectTargetChatRoomHandler={selectTargetChatRoomHandler}
              handleCloseModal={closeCreateGroup}
              setExpandList={setExpand}
            />
          </Box>
        </Fade>
      </Modal>

      {/* Filter Groups Modal */}
      <Modal
        disableScrollLock={true}
        open={filterGroup}
        onClose={closeFilterGroup}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={filterGroup}>
          <Box className={styles.modal}>
            <div className={styles.close_icon_wrapper}>
              <CancelPresentationIcon
                className={styles.close_icon}
                onClick={closeFilterGroup}
              />
            </div>
            <FilterGroups
              socket={socket}
              selectTargetChatRoomHandler={selectTargetChatRoomHandler}
              closeFilterGroup={closeFilterGroup}
              target_room={`${type}_${target_id}`}
              setExpandList={setExpand}
            />
          </Box>
        </Fade>
      </Modal>
    </main>
  );
}

export default memo(GroupsList);
