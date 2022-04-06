import { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  selectTargetChatRoom,
  chatType,
} from "../../redux/message/messageSlice";
import {
  selectTargetFriend,
  selectTargetGroup,
} from "../../redux/user/userSlice";

import MessageInput from "./MessageInput";
import ImageInput from "./ImageInput";
import SelectFriendForGroup from "../group/SelectFriendForGroup";
import SelectGroupForFriend from "../group/SelectGroupForFriend";

// UI //
import styles from "./ChatBoard.module.css";
import { Slide } from "@mui/material";
import ChatLogs from "./ChatLogs";
import MembersList from "../group/MembersList";
import FileInput from "./FileInput";

interface Props {
  socket: Socket | undefined;
  openMemberList: boolean;
  openFriendForGroup: boolean;
  openGroupForFriend: boolean;
  setOpenMemberList: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenFriendForGroup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenGroupForFriend: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatBoard({
  socket,
  openMemberList,
  openFriendForGroup,
  openGroupForFriend,
  setOpenMemberList,
  setOpenFriendForGroup,
  setOpenGroupForFriend,
}: Props): JSX.Element {
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));
  const targetFriend = useSelector(selectTargetFriend(targetChatRoom.id));

  const [imageFile, setImageFile] = useState<File | undefined>();
  const [textFile, setTextFile] = useState<File | undefined>();

  const slideAnchorRef = useRef<HTMLDivElement | null>(null);
  const chatBoardRef = useRef<HTMLDivElement | null>(null);
  const logsRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setImageFile(undefined);
  }, [targetChatRoom]);

  useEffect(() => {
    setTimeout(() => {
      console.log("in chatBoard, resize the input-container");
      inputRef.current!.style.height = "auto";

      const diff =
        chatBoardRef.current!.offsetHeight - inputRef.current!.scrollHeight;
      logsRef.current!.style.height = diff + "px";
      // (1) //
      buttonsRef.current!.style.minHeight =
        inputRef.current!.scrollHeight + "px";
      buttonsRef.current!.style.bottom =
        inputRef.current!.scrollHeight - 40 + "px";

      console.log(buttonsRef.current!.scrollHeight);
    }, 100);
  }, [imageFile]);

  function clearImageHandler() {
    setImageFile(undefined);
  }

  return (
    <main className={styles.main}>
      <div className={styles.body} id="chat-board-container" ref={chatBoardRef}>
        <div
          className={styles.chat_logs}
          id="chat-logs-container"
          ref={logsRef}
        >
          <ChatLogs />
        </div>

        <div
          className={styles.input_container}
          id="input-container"
          ref={inputRef}
        >
          <MessageInput
            socket={socket}
            chatBoardRef={chatBoardRef}
            logsRef={logsRef}
            inputRef={inputRef}
          />
          {imageFile && (
            <div className={styles.preview_image_wrapper}>
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                className={styles.preview_image}
              />
              <button onClick={clearImageHandler}>clear</button>
            </div>
          )}
          <div></div>
        </div>
      </div>

      {/* when the "input-container" shrinks, the background will be inconsistent.
      use this div to cover the that area, to make the transition look better*/}
      <div className={styles.buttons_container} ref={buttonsRef}>
        <ImageInput
          socket={socket}
          setImageFile={setImageFile}
          slideAnchorRef={slideAnchorRef}
        />
        <FileInput />
      </div>

      {/* have to let the <Slide/> anchor on the empty div, so that they won't
      break the position of other elements */}
      <div ref={slideAnchorRef} className={styles.slide_anchor}></div>
      {targetChatRoom.type === chatType.group && (
        <>
          <Slide
            id="custom_scroll_3"
            direction="left"
            in={openMemberList}
            container={slideAnchorRef.current}
          >
            <div className={styles.slide_1st}>
              <MembersList
                socket={socket}
                setOpenMemberList={setOpenMemberList}
              />
            </div>
          </Slide>
          <Slide
            id="custom_scroll_3"
            direction="left"
            in={openFriendForGroup}
            container={slideAnchorRef.current}
          >
            <div className={styles.slide_2nd}>
              <SelectFriendForGroup
                socket={socket}
                group_id={targetGroup.group_id}
                group_name={targetGroup.group_name}
                admin_user_id={targetGroup.admin_user_id}
                setOpenFriendForGroup={setOpenFriendForGroup}
              />
            </div>
          </Slide>
        </>
      )}

      {targetChatRoom.type === chatType.private && (
        <Slide
          id="custom_scroll_3"
          direction="left"
          in={openGroupForFriend}
          container={slideAnchorRef.current}
        >
          <div className={styles.slide_1st}>
            <SelectGroupForFriend
              socket={socket}
              friend_id={targetFriend.friend_id}
              setOpenGroupForFriend={setOpenGroupForFriend}
            />
          </div>
        </Slide>
      )}
    </main>
  );
}

export default memo(ChatBoard);

// NOTE //
/*
  (1)
  also resize the buttons-container's height to cover the input-container's
  background (If I did not use the transparent background in the chat-logs
  I DO NOT have to resize the buttons-containe, because the background
  nconsistence won't be noticeable)
*/
