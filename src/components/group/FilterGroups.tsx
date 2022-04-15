import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import { Group, selectGroupsArray } from "../../redux/user/userSlice";
import RenderGroup from "../menu/left/RenderGroup";

// UI //
import styles from "../friend/FilterFriends.module.css";
import { TextField } from "@mui/material";

interface Props {
  socket: Socket | undefined;
  target_room: string;
  selectTargetChatRoomHandler: (id: string, name: string, type: string) => void;
  closeFilterGroup: () => void;
  setExpandList: React.Dispatch<React.SetStateAction<boolean>>;
}

function FilterGroups({
  socket,
  target_room,
  selectTargetChatRoomHandler,
  closeFilterGroup,
  setExpandList,
}: Props): JSX.Element {
  const GroupsArray = useSelector(selectGroupsArray);

  const [filter, setFilter] = useState<string>("");
  const [filterList, setFilterList] = useState<Group[]>([]);

  useEffect(() => {
    if (GroupsArray) setFilterList(GroupsArray);
  }, [GroupsArray]);

  function inputChangeHandler(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const input = e.target.value;
    if (input.length > 40) return;
    setFilter(input);
    const list = GroupsArray.filter((group) => {
      return group.group_name.toLowerCase().includes(input);
    });
    setFilterList(list);
  }

  function changeTargetHandler() {
    closeFilterGroup();
    setExpandList(true);
  }

  return (
    <main className={styles.main}>
      <div className={styles.title}>Filter Groups</div>
      <div className={styles.border}></div>
      <div className={styles.filter}>
        <TextField
          label="Group Name"
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
          filterList.map((group, index) => {
            return (
              <div key={index} onClick={changeTargetHandler}>
                <RenderGroup
                  group={group}
                  notificationCount={0}
                  socket={socket}
                  selectTargetChatRoomHandler={selectTargetChatRoomHandler}
                  target_room={target_room}
                />
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}

export default memo(FilterGroups);
