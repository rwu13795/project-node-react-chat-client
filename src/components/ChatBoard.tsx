import { ChangeEvent, memo, useState, FormEvent, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import {
  MessageObject,
  selectTargetChatRoom,
  selectTargetChatRoom_history,
  setChatHistory,
} from "../utils/redux/messageSlice";
import { selectUserId, selectUsername } from "../utils/redux/userSlice";

interface Props {
  socket: Socket | undefined;
}

function ChatBoard({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const chatHistory = useSelector(selectTargetChatRoom_history);
  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const targetChatRoom = useSelector(selectTargetChatRoom);

  const [msg, setMsg] = useState<string>("");

  function sendMessageHandler(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();

    const messageObject: MessageObject = {
      sender_id: currentUserId,
      sender_username: currentUsername,
      recipient_id: targetChatRoom.id,
      recipient_username: targetChatRoom.name,
      body: msg,
      created_at: new Date().toDateString(),
    };

    if (socket) {
      socket.emit("messageToServer", {
        ...messageObject,
        targetChatRoom_type: targetChatRoom.type,
      });
    }

    // the server will only send the private messages to the friend's private room,
    // so I need to update the local chat of the current user to display what he
    // just sent out. On the other hand, I don't need to update the group chat here,
    // since the message is sent to the group room, and everyone inside the group
    // room can listen to that message using the "messageToClients" event listener
    dispatch(
      setChatHistory({
        ...messageObject,
        currentUserId,
        targetChatRoom_type: targetChatRoom.type,
      })
    );

    let elem = document.getElementById("chat-board");
    setTimeout(() => {
      if (elem) {
        elem.scrollTo({
          top: elem.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 80);
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  return (
    <main>
      <h1>I am the ChatBoard</h1>
      <h3>
        Chatting with {targetChatRoom.name}-{targetChatRoom.id}
      </h3>
      <form onSubmit={sendMessageHandler}>
        <input type="text" value={msg} onChange={onChangeHandler} />
        <input type="submit" />
      </form>

      <div
        style={{
          width: "90vw",
          minHeight: "50vh",
          maxHeight: "60vh",
          border: "solid black 2px",
          overflow: "auto",
        }}
        id="chat-board"
      >
        {chatHistory.map((msg, index) => {
          return (
            <div
              key={index}
              style={{ border: "blue black 2px", margin: "5px" }}
            >
              <div>
                {msg.sender_username}: {msg.body}
              </div>
              <div>
                to {msg.recipient_username} at {msg.created_at}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default memo(ChatBoard);
