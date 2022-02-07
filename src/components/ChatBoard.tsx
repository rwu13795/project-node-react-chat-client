import {
  ChangeEvent,
  memo,
  useState,
  FormEvent,
  MouseEvent,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import useLastNodeRef from "../utils/hooks/last-node-ref";
import useLoadMoreMessages from "../utils/hooks/load-more-messages";
import {
  MessageObject,
  selectTargetChatRoom,
  selectTargetChatRoom_history,
  addNewMessageToHistory,
  loadMoreOldChatHistory,
} from "../utils/redux/messageSlice";
import { selectUserId, selectUsername } from "../utils/redux/userSlice";

import browserClient from "../utils/axios-client";
import InfiniteScroll from "react-infinite-scroll-component";
/////////////

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

  /////////////// last ref /////////////////////
  const MSG_PER_PAGE = 10;

  const client = browserClient();

  //   const [chatHistory, setChatHistory] = useState<MessageObject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [pageNum, setPageNum] = useState<number>(2);

  // const { isLoading, hasMore } = useLoadMoreMessages(
  //   pageNum,
  //   targetChatRoom.id,
  //   targetChatRoom.type,
  //   currentUserId,
  //   currentUsername
  // );

  // const observer = useRef<IntersectionObserver>();
  // const lastNodeRef = useLastNodeRef(isLoading, observer, hasMore, setPageNum);

  const fetchMoreData = useCallback(async () => {
    const room_identifier = `${targetChatRoom.type}_${targetChatRoom.id}`;
    if (hasMore) {
      console.log("page num", pageNum);

      try {
        const { data } = await client.get<MessageObject[]>(
          "http://localhost:5000/api" +
            `/chat/private-chat-history?id_1=${currentUserId}&id_2=${targetChatRoom.id}&page=${pageNum}`
        );

        setHasMore(data.length >= MSG_PER_PAGE);
        dispatch(
          loadMoreOldChatHistory({
            chatHistory: data,
            room_identifier,
            currentUsername,
            currentUserId,
          })
        );
        setPageNum((prev) => {
          return prev + 1;
        });
      } catch (err) {
        console.log("something went wrong in fetching! ", err);
      }
    }
  }, [
    hasMore,
    targetChatRoom.id,
    targetChatRoom.type,
    pageNum,
    currentUsername,
    currentUserId,
    dispatch,
    client,
  ]);

  /////////////////////////
  ///////////////////////////

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
      addNewMessageToHistory({
        ...messageObject,
        currentUserId,
        targetChatRoom_type: targetChatRoom.type,
      })
    );

    // let elem = document.getElementById("chat-board");
    // setTimeout(() => {
    //   if (elem) {
    //     elem.scrollTo({
    //       top: elem.scrollHeight,
    //       behavior: "smooth",
    //     });
    //   }
    // }, 80);
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
          minHeight: "40vh",
          maxHeight: "40vh",
          border: "solid black 2px",
          overflowY: "auto",
          overflowX: "hidden",
          maxWidth: "300px",
          display: "flex",
          flexDirection: "column-reverse",
          overflowWrap: "break-word",
        }}
        id="chat-board"
      >
        <InfiniteScroll
          dataLength={chatHistory.length}
          next={fetchMoreData}
          //To put endMessage and loader to the top.
          inverse={true} //
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            maxWidth: "300px",
            overflowWrap: "break-word",
          }}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          scrollableTarget="chat-board"
        >
          {chatHistory.map((msg, index) => (
            <div key={index}>
              <div style={{ maxWidth: "250px", overflowWrap: "break-word" }}>
                {msg.body} ------- {msg.created_at}
              </div>
              <div>
                {msg.recipient_username} ------- {msg.sender_username}
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </main>
  );
}

export default memo(ChatBoard);
