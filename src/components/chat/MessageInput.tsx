import { ChangeEvent, FormEvent, memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  addNewMessageToHistory_memory,
  MessageObject,
  msgType,
  selectTargetChatRoom,
} from "../../redux/message/messageSlice";
import { selectUserId, selectUsername } from "../../redux/user/userSlice";

interface Props {
  socket: Socket | undefined;
}

function MessageInput({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const targetChatRoom = useSelector(selectTargetChatRoom);

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
      created_at: new Date().toDateString(),
    };

    if (socket) {
      socket.emit("messageToServer", {
        ...messageObject,
        targetChatRoom_type: targetChatRoom.type,
      });
    }

    // (1) //
    dispatch(
      addNewMessageToHistory_memory({
        ...messageObject,
        targetChatRoom_type: targetChatRoom.type,
      })
    );
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