import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { selectTotalFriendNoteCount } from "../../../redux/message/messageSlice";
import { selectAddFriendRequests } from "../../../redux/user/userSlice";
import SearchUser from "../../friend/SearchUser";
import OnlineOfflineList from "./OnlineOfflineList";
import AddFriendRequest from "../../friend/AddFriendRequest";
import FilterFriends from "../../friend/FilterFriends";

// UI //
import styles from "./GroupsList.module.css";
import {
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
  const [searchUser, setSearchUser] = useState<boolean>(false);
  const [filterFriend, setFilterFriend] = useState<boolean>(false);

  function toggleExpand() {
    setExpand(!expand);
  }
  function openSearchUser() {
    setSearchUser(true);
  }
  function closeSearchUser() {
    setSearchUser(false);
  }
  function openFilterFriend() {
    setFilterFriend(true);
  }
  function closeFilterFriend() {
    setFilterFriend(false);
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

          <ListOptions
            openModal_1={openSearchUser}
            openModal_2={openFilterFriend}
            forFriendsList={true}
          />
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
        open={searchUser}
        onClose={closeSearchUser}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={searchUser}>
          <Box className={styles.modal}>
            <div className={styles.close_icon_wrapper}>
              <CancelPresentationIcon
                className={styles.close_icon}
                onClick={closeSearchUser}
              />
            </div>
            <SearchUser
              socket={socket}
              selectTargetChatRoomHandler={selectTargetChatRoomHandler}
              handleCloseModal={closeSearchUser}
              setExpand={setExpand}
            />
          </Box>
        </Fade>
      </Modal>

      <Modal
        disableScrollLock={true}
        open={filterFriend}
        onClose={closeFilterFriend}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={filterFriend}>
          <Box className={styles.modal}>
            <div className={styles.close_icon_wrapper}>
              <CancelPresentationIcon
                className={styles.close_icon}
                onClick={closeFilterFriend}
              />
            </div>
            <FilterFriends
              selectTargetChatRoomHandler={selectTargetChatRoomHandler}
              closeFilterFriend={closeFilterFriend}
              socket={socket}
              setExpandList={setExpand}
            />
          </Box>
        </Fade>
      </Modal>
    </main>
  );
}

export default memo(FriendsList);
