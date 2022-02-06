import { ChangeEvent, memo, useState, FormEvent, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import {
  selectCurrentMessageRecipient,
  selectFriendChatHistory,
  setFriendChatHistory,
} from "../utils/redux/messageSlice";
import { selectUserId, selectUsername } from "../utils/redux/userSlice";

interface Props {
  socket: Socket | undefined;
}

function ChatBoard({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const friendChatHistory = useSelector(selectFriendChatHistory);

  /////// temp
  const currentUserId = useSelector(selectUserId);
  const currentMessageRecipient = useSelector(selectCurrentMessageRecipient);

  const [msg, setMsg] = useState<string>("");

  function sendMessageHandler(
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();

    if (socket) {
      socket.emit("messageToServer", {
        sender_id: currentUserId,
        receiver_id: currentMessageRecipient,
        body: msg,
        created_at: new Date().toDateString(),
      });
    }

    dispatch(
      setFriendChatHistory({
        sender_id: currentUserId,
        receiver_id: currentMessageRecipient,
        body: msg,
        created_at: new Date().toDateString(),
        currentUserId,
      })
    );
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  return (
    <main>
      <h1>I am the ChatBoard</h1>

      <form onSubmit={sendMessageHandler}>
        <input type="text" value={msg} onChange={onChangeHandler} />
        <input type="submit" />
      </form>

      <div
        style={{ width: "90vw", minHeight: "50vh", border: "solid black 2px" }}
      >
        {friendChatHistory.map((msg, index) => {
          return (
            <div
              key={index}
              style={{ border: "blue black 2px", margin: "5px" }}
            >
              <div>
                {msg.sender_id}: {msg.body}
              </div>
              <div>
                to {msg.receiver_id} at {msg.created_at}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default memo(ChatBoard);
