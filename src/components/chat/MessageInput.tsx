import { Dispatch } from "@reduxjs/toolkit";
import { ChangeEvent, FormEvent, memo, useState } from "react";
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
}

function MessageInput({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));
  const targetFriend = useSelector(selectTargetFriend(targetChatRoom.id));

  const [msg, setMsg] = useState<string>("");

  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    setMsg(e.target.value);
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
        <input type="text" onChange={onChangeHandler} />
        <input type="submit" />
      </form>
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
