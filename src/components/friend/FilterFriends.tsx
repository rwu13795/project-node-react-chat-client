import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { Friend, selectFriendsList } from "../../redux/user/userSlice";
import RenderFriend from "../menu/left/RenderFriend";

// UI //
import styles from "./FilterFriends.module.css";
import { TextField } from "@mui/material";

interface Props {
  socket: Socket | undefined;
  selectTargetChatRoomHandler: (id: string, name: string, type: string) => void;
  closeFilterFriend: () => void;
  setExpandList: React.Dispatch<React.SetStateAction<boolean>>;
}

function FilterFriends({
  socket,
  selectTargetChatRoomHandler,
  closeFilterFriend,
  setExpandList,
}: Props): JSX.Element {
  const friendsList = useSelector(selectFriendsList);

  const [filter, setFilter] = useState<string>("");
  const [filterList, setFilterList] = useState<Friend[]>([]);

  useEffect(() => {
    if (friendsList) setFilterList(Object.values(friendsList));
  }, [friendsList]);

  function inputChangeHandler(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const input = e.target.value;
    if (input.length > 40) return;
    setFilter(input);
    const list = Object.values(friendsList).filter((friend) => {
      if (friend.friend_display_name && friend.friend_display_name !== "") {
        return friend.friend_display_name.toLowerCase().includes(input);
      } else {
        return friend.friend_username.toLowerCase().includes(input);
      }
    });
    setFilterList(list);
  }

  function changeTargetHandler() {
    closeFilterFriend();
    setExpandList(true);
  }

  return (
    <main className={styles.main}>
      <div className={styles.title}>Filter Friends</div>
      <div className={styles.border}></div>
      <div className={styles.filter}>
        <TextField
          label="Friend Username"
          variant="outlined"
          className={styles.filter_text_field}
          value={filter}
          onChange={inputChangeHandler}
        />
      </div>
      <div className={styles.list} id="custom_scroll_2">
        {filter !== "" && filterList.length < 1 ? (
          <div>No match found</div>
        ) : (
          filterList.map((friend, index) => {
            return (
              <div key={index} onClick={changeTargetHandler}>
                <RenderFriend
                  friend={friend}
                  notificationCount={0}
                  socket={socket}
                  selectTargetChatRoomHandler={selectTargetChatRoomHandler}
                  showStatus={false}
                />
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}

export default memo(FilterFriends);
