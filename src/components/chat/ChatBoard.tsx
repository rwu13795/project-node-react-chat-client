import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";

import {
  MessageObject,
  selectTargetChatRoom,
  selectTargetChatRoom_history,
  loadMoreOldChatHistory_database,
  chatType,
  selectInfiniteScrollStats,
  setInfiniteScrollStats,
  selectLoadingStatus_msg,
} from "../../redux/message/messageSlice";
import {
  selectTargetFriend,
  selectTargetGroup,
  selectUserId,
  selectUsername,
} from "../../redux/user/userSlice";

import InfiniteScroll from "react-infinite-scroll-component";
import MessageInput from "./MessageInput";
import ImageInput from "./ImageInput";
import { client } from "../../redux/utils";
import { loadingStatusEnum } from "../../utils";

// UI //

import background from "../../images/background.jpg";

interface Props {
  socket: Socket | undefined;
}

function ChatBoard({ socket }: Props): JSX.Element {
  const dispatch = useDispatch();

  const chatHistory = useSelector(selectTargetChatRoom_history);
  const currentUserId = useSelector(selectUserId);
  const currentUsername = useSelector(selectUsername);
  const targetChatRoom = useSelector(selectTargetChatRoom);
  const targetGroup = useSelector(selectTargetGroup(targetChatRoom.id));
  const targetFriend = useSelector(selectTargetFriend(targetChatRoom.id));
  const infiniteScrollStats = useSelector(selectInfiniteScrollStats);
  const loadingStatus = useSelector(selectLoadingStatus_msg);

  const MSG_PER_PAGE = 10;

  const [showLoader, setShowLoader] = useState<boolean>(false);

  useEffect(() => {
    if (infiniteScrollStats[`${targetChatRoom.type}_${targetChatRoom.id}`]) {
      setShowLoader(
        infiniteScrollStats[`${targetChatRoom.type}_${targetChatRoom.id}`]
          .hasMore && chatHistory.length >= MSG_PER_PAGE
      );
    }
  }, [infiniteScrollStats, chatHistory, targetChatRoom]);

  const fetchMoreData = useCallback(async () => {
    const { type, id, date_limit } = targetChatRoom;
    const room_id = `${type}_${id}`;
    const { hasMore, pageNum } = infiniteScrollStats[`${type}_${id}`];
    if (hasMore && chatHistory.length >= MSG_PER_PAGE) {
      // have to put "chatHistory.length >= MSG_PER_PAGE" in the condition
      // otherwise, whenever user enters a room, the "fetchMoreData" will be triggered
      // even the the last element is not in view
      // I guess that the "fetchMoreData" is triggered on dataLength={chatHistory.length}
      // the <InifinteScroll /> might still used the previous chatHistory.length
      // after the room changed in the first rendering
      console.log("page num", pageNum);
      console.log("hasMore", hasMore);
      console.log("fetching more chatHistory");
      try {
        const { data } = await client.get<MessageObject[]>(
          "http://localhost:5000/api" +
            `/chat/chat-history?id_1=${currentUserId}&id_2=${id}&page=${pageNum}&type=${type}&date_limit=${date_limit}`
        );

        dispatch(
          setInfiniteScrollStats({ hasMore: data.length >= MSG_PER_PAGE })
        );
        dispatch(
          loadMoreOldChatHistory_database({
            chatHistory: data,
            room_id,
            currentUsername,
            currentUserId,
          })
        );
        dispatch(
          setInfiniteScrollStats({
            pageNum: infiniteScrollStats[`${type}_${id}`].pageNum + 1,
          })
        );
      } catch (err) {
        console.log("something went wrong in fetching! ", err);
      }
    }
  }, [
    targetChatRoom,
    currentUsername,
    currentUserId,
    dispatch,
    client,
    infiniteScrollStats,
    chatHistory.length,
  ]);

  return (
    <main>
      {targetChatRoom.id && (
        <div>
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
              hasMore={
                infiniteScrollStats[
                  `${targetChatRoom.type}_${targetChatRoom.id}`
                ] === undefined
                  ? false
                  : infiniteScrollStats[
                      `${targetChatRoom.type}_${targetChatRoom.id}`
                    ].hasMore
              }
              loader={showLoader ? <h4>Loading...</h4> : <div></div>}
              scrollableTarget="chat-board"
            >
              {loadingStatus === loadingStatusEnum.changingTargetRoom ? (
                <h1>Loading shit load of msg</h1>
              ) : (
                chatHistory.map((msg, index) => {
                  let folder = "users";
                  let folder_id = currentUserId; // the private folder of the current user
                  if (targetChatRoom.type === chatType.group) {
                    folder = "groups";
                    folder_id = targetChatRoom.id;
                  }

                  // console.log("msg.warning", msg.warning);

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
                                : `https://d229fmuzhn8qxo.cloudfront.net/${folder}/${folder_id}/${msg.file_url}`
                            }
                          />
                        </div>
                      ) : (
                        <div>
                          <div>
                            User {msg.sender_id} sent to User {msg.recipient_id}
                          </div>
                          <div style={{ color: msg.warning ? "red" : "black" }}>
                            {msg.msg_body} @ {msg.created_at}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </InfiniteScroll>
          </div>
          <br />
          <MessageInput socket={socket} />
          <ImageInput socket={socket} />
        </div>
      )}

      {/* {imageFile && <img src={URL.createObjectURL(imageFile)} alt="input" />} */}
    </main>
  );
}

export default memo(ChatBoard);
