import { TextField } from "@mui/material";
import { Dispatch } from "@reduxjs/toolkit";
import {
  ChangeEvent,
  FormEvent,
  memo,
  MutableRefObject,
  useEffect,
  useRef,
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

interface Props {
  socket: Socket | undefined;
  chatBoardRef: React.MutableRefObject<HTMLDivElement | null>;
  logsRef: React.MutableRefObject<HTMLDivElement | null>;
  inputRef: React.MutableRefObject<HTMLDivElement | null>;
}

function MessageInput({
  socket,
  chatBoardRef,
  logsRef,
  inputRef,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));
  const targetFriend = useSelector(selectTargetFriend(targetChatRoom.id));

  const [msg, setMsg] = useState<string>("");
  const inputFieldRef = useRef<HTMLDivElement | null>(null);

  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    setMsg("");
  }, []);

  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    setMsg(e.target.value);

    // const log = document.getElementById("chat-logs-container");
    // const input = document.getElementById("input-container");
    // const board = document.getElementById("chat-board-container");

    // if (log && input && board) {
    //   setTimeout(() => {
    //     console.log("board.offsetHeight", board.offsetHeight);
    //     console.log("input.scrollHeight", input.scrollHeight);
    //     console.log("log.style.height", log.style.height);
    //     log.style.height = board.offsetHeight - input.scrollHeight + "px";
    //     console.log("log.style.height", log.style.height);
    //     // input.style.height = "auto";
    //   }, 100);
    // }

    setTimeout(() => {
      console.log("board.offsetHeight", chatBoardRef.current!.offsetHeight);
      console.log("input.scrollHeight", inputRef.current!.scrollHeight);
      console.log("log.style.height", logsRef.current!.style.height);
      logsRef.current!.style.height =
        chatBoardRef.current!.offsetHeight -
        inputRef.current!.scrollHeight +
        "px";
      console.log("log.style.height", logsRef.current!.style.height);
      // input.style.height = "auto";
    }, 100);
  }

  function sendMessageHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const messageObject: MessageObject = {
      sender_id: currentUserId,
      sender_name: currentUsername,
      recipient_id: targetChatRoom.id,
      recipient_name: targetChatRoom.name,
      msg_body: msg,
      msg_type: msgType.text,
      created_at: new Date().toString(),
    };

    // (1) //

    // check if the user was kicked out of the group or blocked by a friend
    // if (targetChatRoom.type === chatType.group) {
    //   if (targetGroup && targetGroup.user_left) return;
    // } else {
    //   if (
    //     targetFriend &&
    //     (targetFriend.friend_blocked_user || targetFriend.user_blocked_friend)
    //   ) {
    //     messageObject.msg_body = `You ${
    //       targetFriend.user_blocked_friend ? "blocked" : "were blocked by"
    //     }
    //             this friend, you cannot send any message to him/her!`;
    //     dispatch(
    //       addNewMessageToHistory_memory({
    //         ...messageObject,
    //         targetChatRoom_type: targetChatRoom.type,
    //       })
    //     );
    //     return;
    //   }
    // }
    const warning = inputWarningHandler(
      targetGroup,
      targetFriend,
      targetChatRoom.type,
      messageObject,
      dispatch
    );
    if (warning) return;

    setMsg("");
    dispatch(
      addNewMessageToHistory_memory({
        messageObject,
        room_type: targetChatRoom.type,
      })
    );
    if (socket) {
      message_emitter(socket, {
        messageObject,
        room_type: targetChatRoom.type,
      });
    }
  }

  return (
    <main>
      <h4>I am the Message Input</h4>
      <form onSubmit={sendMessageHandler}>
        {/* <input type="text" onChange={onChangeHandler} value={msg} /> */}
        <input type="submit" />
      </form>
      <TextField
        multiline={true}
        maxRows={4}
        onChange={onChangeHandler}
        value={msg}
        ref={inputFieldRef}
      />
    </main>
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
