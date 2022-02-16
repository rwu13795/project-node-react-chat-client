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

import {
  MessageObject,
  selectTargetChatRoom,
  selectTargetChatRoom_history,
  addNewMessageToHistory_memory,
  loadMoreOldChatHistory_database,
} from "../../redux/message/messageSlice";
import { selectUserId, selectUsername } from "../../redux/user/userSlice";

import browserClient from "../../utils/axios-client";
import InfiniteScroll from "react-infinite-scroll-component";
import MessageInput from "./MessageInput";
import ImageInput from "./ImageInput";
/////////////

interface Props {
  socket: Socket | undefined;
}

function ChatBoard({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();
  const client = browserClient();

  const chatHistory = useSelector(selectTargetChatRoom_history);
  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const targetChatRoom = useSelector(selectTargetChatRoom);

  const MSG_PER_PAGE = 10;
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [pageNum, setPageNum] = useState<number>(2);

  // useEffect(()=>{

  // }, [targetChatRoom])

  const fetchMoreData = useCallback(async () => {
    const room_id = `${targetChatRoom.type}_${targetChatRoom.id}`;
    if (hasMore) {
      console.log("page num", pageNum);

      try {
        const { data } = await client.get<MessageObject[]>(
          "http://localhost:5000/api" +
            `/chat/chat-history?id_1=${currentUserId}&id_2=${targetChatRoom.id}&page=${pageNum}&type=${targetChatRoom.type}`
        );

        setHasMore(data.length >= MSG_PER_PAGE);
        dispatch(
          loadMoreOldChatHistory_database({
            chatHistory: data,
            room_id,
            currentUsername,
            currentUserId,
            room_type: targetChatRoom.type,
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

  return (
    <main>
      <h1>I am the ChatBoard</h1>
      <h3>
        Chatting with {targetChatRoom.name}-{targetChatRoom.id}
      </h3>

      {/* {imageFile && <img src={URL.createObjectURL(imageFile)} alt="input" />} */}

      <div
        style={{
          width: "90%",
          minHeight: "40vh",
          maxHeight: "40vh",
          border: "solid black 2px",
          overflowY: "auto",
          overflowX: "hidden",
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
          {chatHistory.map((msg, index) => {
            console.log("msg.file_localUrl", msg.file_localUrl);

            return (
              <div key={index}>
                {msg.msg_type === "image" ? (
                  <div>
                    <div>
                      User {msg.sender_id} sent to User {msg.recipient_id}
                    </div>
                    <img
                      alt="tesing"
                      src={
                        msg.file_localUrl
                          ? msg.file_localUrl
                          : `https://d229fmuzhn8qxo.cloudfront.net/users/${currentUserId}/${msg.file_url}`
                      }
                    />
                  </div>
                ) : (
                  <div>
                    <div>
                      User {msg.sender_id} sent to User {msg.recipient_id}
                    </div>
                    <div>
                      {msg.msg_body} @ {msg.created_at}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
      <br />
      <MessageInput socket={socket} />
      <ImageInput socket={socket} />
    </main>
  );
}

export default memo(ChatBoard);
