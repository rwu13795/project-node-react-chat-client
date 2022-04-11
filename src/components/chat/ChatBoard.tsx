import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  selectTargetChatRoom,
  addNewMessageToHistory_memory,
  msgType,
  MessageObject,
} from "../../redux/message/messageSlice";
import {
  selectTargetFriend,
  selectTargetGroup,
  selectUserId,
  selectUsername,
} from "../../redux/user/userSlice";
import { message_emitter } from "../../socket-io/emitters";
import MessageInput from "./MessageInput";
import ImageInput from "./ImageInput";
import ChatLogs from "./ChatLogs";
import FileInput from "./FileInput";
import { warningMessage } from "../../utils";
import ChatBoardSlides from "./ChatBoardSlides";
import FilePreview from "./FilePreview";

// UI //
import styles from "./ChatBoard.module.css";
import styles_2 from "./ImageInput.module.css";
import InsertEmoticonRoundedIcon from "@mui/icons-material/InsertEmoticonRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Button, useMediaQuery } from "@mui/material";
import EmojiPicker from "./EmojiPicker";

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
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));
  const targetFriend = useSelector(selectTargetFriend(targetChatRoom.id));
  const isSmall = useMediaQuery("(max-width: 765px)");

  const [messageValue, setMessageValue] = useState<string>("");
  const [messageError, setMessageError] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [textFile, setTextFile] = useState<File | undefined>();
  const [sizeExceeded, setSizeExceeded] = useState<string>("");
  const [notSupported, setNotSupported] = useState<string>("");
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);

  const slideAnchorRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const logsScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessageValue("");
    setMessageError("");
    setImageFile(undefined);
    setTextFile(undefined);
    setOpenEmojiPicker(false);
    if (emojiPickerRef && emojiPickerRef.current) {
      emojiPickerRef.current.style.height = "0";
      emojiPickerRef.current.style.padding = "0";
      emojiPickerRef.current.style.marginTop = "0";
    }
    if (imageInputRef && imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [targetChatRoom]);

  function clearImageHandler() {
    setImageFile(undefined);
    if (imageInputRef && imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }
  function clearFileHandler() {
    setTextFile(undefined);
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
  function toggleEmojiPicker() {
    if (!emojiPickerRef || !emojiPickerRef.current) return;
    setOpenEmojiPicker((prev) => !prev);
    // (1) //
    if (openEmojiPicker) {
      emojiPickerRef.current.style.height = "0";
      emojiPickerRef.current.style.padding = "0";
      emojiPickerRef.current.style.marginTop = "0";
    } else {
      emojiPickerRef.current.style.display = "flex";
      emojiPickerRef.current.style.padding = "4px";
      emojiPickerRef.current.style.marginTop = "6px";
      emojiPickerRef.current.style.height = "200px";
    }
  }

  function sendMessageHandler() {
    if (messageValue.trim() === "" && !(imageFile || textFile)) return;
    setMessageValue("");

    let msg_type = msgType.text;
    let file_name: string = "";
    let file_body: File | undefined = undefined;
    let file_type: string = "";
    if (imageFile) {
      msg_type = msgType.image;
      file_name = imageFile.name;
      file_body = imageFile;
    }
    if (textFile) {
      msg_type = msgType.file;
      file_name = textFile.name;
      file_type = file_name.split(".")[1];
      file_body = textFile;
    }

    const messageObject: MessageObject = {
      sender_id: currentUserId,
      sender_name: currentUsername,
      recipient_id: targetChatRoom.id,
      recipient_name: targetChatRoom.name,
      msg_body: messageValue,
      msg_type,
      file_localUrl: imageFile ? URL.createObjectURL(imageFile) : "",
      file_name,
      file_type,
      created_at: new Date().toString(),
    };
    // check if the user was kicked out of the group or blocked by a friend
    const warning = warningMessage(
      targetGroup,
      targetFriend,
      targetChatRoom.type,
      messageObject,
      dispatch
    );
    if (warning) return;

    setMessageValue("");
    dispatch(
      addNewMessageToHistory_memory({
        messageObject,
        room_type: targetChatRoom.type,
      })
    );
    if (socket) {
      message_emitter(socket, {
        messageObject: { ...messageObject, file_body: file_body },
        room_type: targetChatRoom.type,
      });
    }

    // auto scroll to bottom after sending a message
    // logsScrollRef.current.scrollTop = logsScrollRef.current.offsetHeight;
    setTimeout(() => {
      if (logsScrollRef && logsScrollRef.current) {
        logsScrollRef.current.scrollTo({
          top: logsScrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 200);
    clearImageHandler();
    clearFileHandler();
    if (openEmojiPicker) toggleEmojiPicker();
  }

  return (
    <main className={styles.main}>
      <div className={styles.body} id="chat-board-container">
        <div className={styles.chat_logs} id="chat-logs-container">
          <ChatLogs
            logsScrollRef={logsScrollRef}
            targetFriend={targetFriend}
            targetChatRoom={targetChatRoom}
          />
        </div>

        <div
          className={styles.input_container}
          id="input-container"
          onSubmit={sendMessageHandler}
        >
          <MessageInput
            messageError={messageError}
            messageValue={messageValue}
            setMessageError={setMessageError}
            setMessageValue={setMessageValue}
            sendMessageHandler={sendMessageHandler}
          />
          <FilePreview
            imageFile={imageFile}
            textFile={undefined}
            clearHandler={clearImageHandler}
            isImage={true}
          />
          <FilePreview
            imageFile={undefined}
            textFile={textFile}
            clearHandler={clearFileHandler}
            isImage={false}
          />
          <EmojiPicker
            emojiPickerRef={emojiPickerRef}
            setMessageValue={setMessageValue}
          />

          <div className={styles.file_warning}>{notSupported}</div>
          <div className={styles.file_warning}>{sizeExceeded}</div>
        </div>
      </div>

      {/* when the "input-container" shrinks or expands, there will be a gap
      between itself and the "button_container", the background will look inconsistent.
      So I need to shrink or expand the "button_container" at the same time to make
      the transition look better */}
      <div className={styles.buttons_container}>
        <div className={styles.buttons_wrapper}>
          <div className={styles.buttons_wrapper_left}>
            <div className={styles_2.icon_wrapper}>
              <InsertEmoticonRoundedIcon
                className={styles_2.input_icon}
                onClick={toggleEmojiPicker}
              />
            </div>
            <ImageInput
              imageInputRef={imageInputRef}
              clearFileHandler={clearFileHandler}
              setImageFile={setImageFile}
              setSizeExceeded={setSizeExceeded}
              setNotSupported={setNotSupported}
            />
            <FileInput
              fileInputRef={fileInputRef}
              clearImageHandler={clearImageHandler}
              setTextFile={setTextFile}
              setSizeExceeded={setSizeExceeded}
              setNotSupported={setNotSupported}
            />
          </div>

          <Button
            className={styles.send_button}
            variant="outlined"
            onClick={sendMessageHandler}
          >
            <div className={styles.send_button_content}>
              {!isSmall && <SendRoundedIcon />}
            </div>
            <div className={styles.send_button_content}>Send</div>
          </Button>
        </div>
      </div>

      {/* have to let the <Slide/> anchor on the empty div, so that they won't
      break the position of other elements */}
      <div ref={slideAnchorRef} className={styles.slide_anchor}></div>
      <ChatBoardSlides
        socket={socket}
        targetGroup={targetGroup}
        targetFriend={targetFriend}
        targetChatRoom={targetChatRoom}
        slideAnchorRef={slideAnchorRef}
        openMemberList={openMemberList}
        openFriendForGroup={openFriendForGroup}
        openGroupForFriend={openGroupForFriend}
        setOpenMemberList={setOpenMemberList}
        setOpenFriendForGroup={setOpenFriendForGroup}
        setOpenGroupForFriend={setOpenGroupForFriend}
      />
    </main>
  );
}

export default memo(ChatBoard);

// NOTE //
/*

// (1) //
since the "openEmojiPicker" has to be passed to the EmojiPicker, and the re-rendering
cause the delay to styles transition, I have to change CSS here when the toggleEmojiPicker
is triggered and before the "openEmojiPicker" is updated.
This method could also apply to the FilePreview so that I don't need to use the
resize function. But the compennet has to be mounted all the  time in
order to trigger the styles transition

// the Refs used in the old resize function

  const chatBoardRef = useRef<HTMLDivElement | null>(null);
  const logsRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

*/
