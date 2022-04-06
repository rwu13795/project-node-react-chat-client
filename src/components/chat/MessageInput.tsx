import { FormControl, FormHelperText, TextField } from "@mui/material";
import { Dispatch } from "@reduxjs/toolkit";
import {
  ChangeEvent,
  FormEvent,
  FocusEvent,
  memo,
  MutableRefObject,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  addNewMessageToHistory_memory,
  chatType,
  MessageObject,
  msgType,
  selectTargetChatRoom,
} from "../../redux/message/messageSlice";
import {
  Friend,
  Group,
  selectTargetFriend,
  selectTargetGroup,
  selectUserId,
  selectUsername,
} from "../../redux/user/userSlice";
import { message_emitter } from "../../socket-io/emitters";
import {
  inputNames,
  onBlurCheck,
  onChangeCheck,
  onFocusCheck,
  resizeChatBoard,
} from "../../utils";
import InputField, { InputFields } from "../input-field/InputField";

// UI //
import styles from "./MessageInput.module.css";

interface Props {
  socket: Socket | undefined;
  chatBoardRef: MutableRefObject<HTMLDivElement | null>;
  logsRef: MutableRefObject<HTMLDivElement | null>;
  inputRef: MutableRefObject<HTMLDivElement | null>;
  buttonsRef: MutableRefObject<HTMLDivElement | null>;
}

function MessageInput({
  socket,
  chatBoardRef,
  logsRef,
  inputRef,
  buttonsRef,
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

  const [prevHeight, setPrevHeight] = useState<number>(0);
  const [touched, setTouched] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    if (messageError[inputNames.message] !== "") {
      setShowError(true);
    } else {
      setShowError(false);
    }
  }, [messageError]);

  useEffect(() => {
    setMessageValue({ [inputNames.message]: "" });
  }, []);

  function onFocusHandler() {
    onFocusCheck(setTouched);
  }

  function onBlurHandler(e: FocusEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget;
    onBlurCheck(name, value, touched, setMessageError);
  }

  // since the resizing has to be in the onChangeHandler, I cannot use <InputField />
  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const hasError = onChangeCheck(name, value, setMessageError);
    if (hasError) return;

    setMessageValue({
      [inputNames.message]: value,
    });

    if (prevHeight === 0) {
      setPrevHeight(inputRef.current!.scrollHeight);
      return;
    }

    setTimeout(() => {
      setPrevHeight(inputRef.current!.scrollHeight);
      if (
        prevHeight !== inputRef.current!.scrollHeight &&
        Math.abs(prevHeight - inputRef.current!.scrollHeight) > 1
      ) {
        resizeChatBoard(chatBoardRef, inputRef, logsRef, buttonsRef);
      }
    }, 100);
  }

  function sendMessageHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    //   const messageObject: MessageObject = {
    //     sender_id: currentUserId,
    //     sender_name: currentUsername,
    //     recipient_id: targetChatRoom.id,
    //     recipient_name: targetChatRoom.name,
    //     msg_body: msg,
    //     msg_type: msgType.text,
    //     created_at: new Date().toString(),
    //   };

    //   // (1) //
    //   const warning = inputWarningHandler(
    //     targetGroup,
    //     targetFriend,
    //     targetChatRoom.type,
    //     messageObject,
    //     dispatch
    //   );
    //   if (warning) return;

    //   setMessageValue({ [inputNames.message]: "" });
    //   dispatch(
    //     addNewMessageToHistory_memory({
    //       messageObject,
    //       room_type: targetChatRoom.type,
    //     })
    //   );
    //   if (socket) {
    //     message_emitter(socket, {
    //       messageObject,
    //       room_type: targetChatRoom.type,
    //     });
    //   }
  }

  return (
    <form onSubmit={sendMessageHandler} className={styles.input_field_wrapper}>
      <FormControl error={showError}>
        <TextField
          onChange={onChangeHandler}
          multiline={true}
          maxRows={3}
          placeholder="Send a message"
          className={styles.input_field}
          error={showError}
        />
      </FormControl>
      <FormHelperText className={styles.error}>
        {messageError[inputNames.message]}
      </FormHelperText>
    </form>
  );
}

export default memo(MessageInput);

// NOTES //
/*
(1)
  the server will only send the private messages to the friend's private room,
  so I need to update the local chat of the current user to display what he
  just sent out. Moreover, I don't need to update the group chat here,
  since the message is sent to the group room, and everyone inside the group
  room can listen to that message using the "messageToClients" event listener,
  that is where I add the new message in group chat
*/

function inputWarningHandler(
  targetGroup: Group,
  targetFriend: Friend,
  room_type: string,
  messageObject: MessageObject,
  dispatch: Dispatch
): boolean {
  if (room_type === chatType.group) {
    if (targetGroup && targetGroup.user_left) {
      messageObject.msg_body = `You cannot send any message to this group since you have left.`;
      messageObject.warning = true;
      messageObject.created_at = "";
      dispatch(
        addNewMessageToHistory_memory({
          messageObject,
          room_type,
        })
      );
      return true;
    } else {
      return false;
    }
  } else {
    if (
      targetFriend &&
      (targetFriend.friend_blocked_user || targetFriend.user_blocked_friend)
    ) {
      messageObject.msg_body = `You ${
        targetFriend.user_blocked_friend ? "blocked" : "were blocked by"
      } this friend, you cannot send any message to him/her!`;
      messageObject.warning = true;
      messageObject.created_at = "";
      console.log("messageObject", messageObject);
      dispatch(
        addNewMessageToHistory_memory({
          messageObject,
          room_type,
        })
      );
      return true;
    } else {
      return false;
    }
  }
}
