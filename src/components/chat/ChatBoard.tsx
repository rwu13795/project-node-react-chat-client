import {
  FormEvent,
  MouseEvent,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  selectTargetChatRoom,
  chatType,
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

import MessageInput from "./MessageInput";
import ImageInput from "./ImageInput";
import SelectFriendForGroup from "../group/SelectFriendForGroup";
import SelectGroupForFriend from "../group/SelectGroupForFriend";
import ChatLogs from "./ChatLogs";
import MembersList from "../group/MembersList";
import FileInput from "./FileInput";
import { inputNames, resizeChatBoard, warningMessage } from "../../utils";

// UI //
import styles from "./ChatBoard.module.css";
import { Slide } from "@mui/material";
import { InputFields } from "../input-field/InputField";
import ChatBoardSlides from "./ChatBoardSlides";
import { message_emitter } from "../../socket-io/emitters";

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

  const [messageValue, setMessageValue] = useState<InputFields>({
    [inputNames.message]: "",
  });
  const [messageError, setMessageError] = useState<InputFields>({
    [inputNames.message]: "",
  });
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [textFile, setTextFile] = useState<File | undefined>();
  const [sizeExceeded, setSizeExceeded] = useState<string>("");
  const [notSupported, setNotSupported] = useState<string>("");

  const slideAnchorRef = useRef<HTMLDivElement | null>(null);
  const chatBoardRef = useRef<HTMLDivElement | null>(null);
  const logsRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setImageFile(undefined);
  }, [targetChatRoom]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      resizeChatBoard(chatBoardRef, inputRef, logsRef, buttonsRef);
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  }, [imageFile]);

  function clearImageHandler() {
    setImageFile(undefined);
  }

  function sendMessageHandler() {
    console.log(messageValue);
    console.log(imageFile);
    setMessageValue({ [inputNames.message]: "" });

    let msg_type = msgType.text;
    let file_name: string = "";
    let file_body: File | undefined = undefined;
    if (imageFile) {
      msg_type = msgType.image;
      file_name = imageFile.name;
      file_body = imageFile;
    }
    if (textFile) {
      msg_type = msgType.file;
      file_name = textFile.name;
      file_body = textFile;
    }

    const messageObject: MessageObject = {
      sender_id: currentUserId,
      sender_name: currentUsername,
      recipient_id: targetChatRoom.id,
      recipient_name: targetChatRoom.name,
      msg_body: messageValue[inputNames.message],
      msg_type,
      file_localUrl: imageFile ? URL.createObjectURL(imageFile) : "",
      file_name,
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

    setMessageValue({ [inputNames.message]: "" });
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

    setTimeout(() => {
      resizeChatBoard(chatBoardRef, inputRef, logsRef, buttonsRef);
    }, 100);
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
          onSubmit={sendMessageHandler}
        >
          <MessageInput
            messageError={messageError}
            messageValue={messageValue}
            setMessageError={setMessageError}
            setMessageValue={setMessageValue}
            sendMessageHandler={sendMessageHandler}
            chatBoardRef={chatBoardRef}
            logsRef={logsRef}
            inputRef={inputRef}
            buttonsRef={buttonsRef}
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
          <div className={styles.file_warning}>{notSupported}</div>
          <div className={styles.file_warning}>{sizeExceeded}</div>
        </div>
      </div>

      {/* when the "input-container" shrinks or expands, there will be a gap
      between itself and the "button_container", the background will look inconsistent.
      So I need to shrink or expand the "button_container" at the same time to make
      the transition look better */}
      <div className={styles.buttons_container} ref={buttonsRef}>
        <ImageInput
          setImageFile={setImageFile}
          setSizeExceeded={setSizeExceeded}
          setNotSupported={setNotSupported}
        />
        <FileInput
          setTextFile={setTextFile}
          setSizeExceeded={setSizeExceeded}
          setNotSupported={setNotSupported}
        />
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
