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
} from "../redux/message/messageSlice";
import { selectUserId, selectUsername } from "../redux/user/userSlice";

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
    const room_id = `${targetChatRoom.type}_${targetChatRoom.id}`;
    if (hasMore) {
      console.log("page num", pageNum);

      try {
        const { data } = await client.get<MessageObject[]>(
          "http://localhost:5000/api" +
            `/chat/private-chat-history?id_1=${currentUserId}&id_2=${targetChatRoom.id}&page=${pageNum}`
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

  /////////////////////////
  ///////////////////////////

  function sendMessageHandler(e: FormEvent<HTMLFormElement>, msg_type: string) {
    e.preventDefault();

    const messageObject: MessageObject = {
      sender_id: currentUserId,
      sender_username: currentUsername,
      recipient_id: targetChatRoom.id,
      recipient_username: targetChatRoom.name,
      msg_body: "",
      msg_type: "",
      created_at: new Date().toDateString(),
    };

    if (socket) {
      // change the messageObject according to the msg_type
      if (msg_type === "text") {
        messageObject.msg_body = msg;
        messageObject.msg_type = msg_type;
      } else {
        messageObject.file_url = URL.createObjectURL(imageFile!);
        messageObject.file_body = imageFile;
        messageObject.msg_type = "image";
      }

      socket.emit("messageToServer", {
        ...messageObject,
        targetChatRoom_type: targetChatRoom.type,
      });
    }

    // (1) //
    dispatch(
      addNewMessageToHistory_memory({
        ...messageObject,
        file_body: "",
        targetChatRoom_type: targetChatRoom.type,
      })
    );

    // scroll to down to show the new message
    // let elem = document.getElementById("chat-board");
    // console.log("elem found !", elem);
    // setTimeout(() => {
    //   if (elem) {
    //     elem.scrollTo({
    //       top: elem.scrollHeight,
    //       behavior: "smooth",
    //     });
    //   }
    // }, 280);
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  ////////// testing send image
  const [imageFile, setImageFile] = useState<File>();

  const sendImageHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /* 
    the imageFile contains {
      name: "cat1.jpg"
      size: 16176  (in bytes)
      type: "image/jpeg"
    }
    when it is sent to server, the imageFile will be a stream of Buffer
    that can be ?upload to S3 directly?
    */

    if (socket) {
      socket.emit("imageToServer", {
        body: imageFile,
        messageType: imageFile?.type,
        fileName: imageFile?.name,
      });
    }
  };

  const onImageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImage = e.target.files[0] as File;
      // check the extension of the file, if not txt, docx, pdf, don't let user send
      // check the type of the file, if it is not of image, don't let user send
      console.log(newImage.name.split(".")[1]);
      console.log(URL.createObjectURL(newImage));
      setImageFile(newImage);
    }
  };

  return (
    <main>
      <h1>I am the ChatBoard</h1>
      <h3>
        Chatting with {targetChatRoom.name}-{targetChatRoom.id}
      </h3>
      <form onSubmit={(e) => sendMessageHandler(e, "text")}>
        {/* should limit to 250 characters */}
        <input type="text" value={msg} onChange={onChangeHandler} />
        <input type="submit" />
      </form>

      <form onSubmit={(e) => sendMessageHandler(e, "file")}>
        <input
          type="file"
          // accept=".txt, .pdf, .docx"
          accept="image/*"
          onChange={onImageChangeHandler}
        />
        <input type="submit" />
      </form>

      {imageFile && <img src={URL.createObjectURL(imageFile)} alt="input" />}

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
          {chatHistory.map((msg, index) => {
            console.log(msg.file_url);
            return (
              <div key={index}>
                <div style={{ maxWidth: "250px", overflowWrap: "break-word" }}>
                  {msg.msg_type !== "image" && (
                    <div>
                      {msg.msg_body} ------- {msg.created_at}
                    </div>
                  )}
                  <div>
                    <img alt="testing" src={msg.file_url} />
                  </div>
                </div>
                <div>
                  {msg.recipient_username} ------- {msg.sender_username}
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </main>
  );
}

export default memo(ChatBoard);

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
