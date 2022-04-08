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
  TargetChatRoom,
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
  messageError: string;
  messageValue: string;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  setMessageValue: React.Dispatch<React.SetStateAction<string>>;
  sendMessageHandler: () => void;
  chatBoardRef: MutableRefObject<HTMLDivElement | null>;
  logsRef: MutableRefObject<HTMLDivElement | null>;
  inputRef: MutableRefObject<HTMLDivElement | null>;
  buttonsRef: MutableRefObject<HTMLDivElement | null>;
}

function MessageInput({
  messageError,
  messageValue,
  setMessageError,
  setMessageValue,
  sendMessageHandler,
  chatBoardRef,
  logsRef,
  inputRef,
  buttonsRef,
}: Props): JSX.Element {
  const [prevHeight, setPrevHeight] = useState<number>(0);

  useEffect(() => {
    setMessageValue("");
  }, []);

  // since the resizing has to be in the onChangeHandler, I cannot use <InputField />
  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    setMessageError("");

    const value = e.target.value;
    if (value.length > 250) {
      setMessageError("The message exceeds 250-charater limit");
      return;
    }
    setMessageValue(value);

    // if (prevHeight === 0) {
    //   setPrevHeight(inputRef.current!.scrollHeight);
    //   return;
    // }

    // setTimeout(() => {
    //   setPrevHeight(inputRef.current!.scrollHeight);
    //   if (
    //     prevHeight !== inputRef.current!.scrollHeight &&
    //     Math.abs(prevHeight - inputRef.current!.scrollHeight) > 1
    //   ) {
    //     resizeChatBoard(chatBoardRef, inputRef, logsRef, buttonsRef);
    //   }
    // }, 100);
  }

  function onSubmitUsingEnter(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.code === "Enter") {
      console.log("enter hit");
      e.preventDefault();
      sendMessageHandler();
    }
  }

  return (
    <main className={styles.input_field_wrapper}>
      <FormControl error={messageError !== ""}>
        <TextField
          value={messageValue}
          onChange={onChangeHandler}
          onKeyDown={onSubmitUsingEnter}
          multiline={true}
          maxRows={3}
          placeholder="Send a message"
          className={styles.input_field}
          error={messageError !== ""}
        />
      </FormControl>
      <FormHelperText className={styles.error}>{messageError}</FormHelperText>
    </main>
  );
}

export default memo(MessageInput);
