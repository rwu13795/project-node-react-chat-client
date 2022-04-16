import { memo, useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";

import {
  chatType,
  loadMoreOldChatHistory_database,
  MessageObject,
  selectInfiniteScrollStats,
  selectLoadingStatus_2_msg,
  selectLoadingStatus_msg,
  selectTargetChatRoom_history,
  setInfiniteScrollStats,
  TargetChatRoom,
} from "../../redux/message/messageSlice";
import {
  Friend,
  selectCurrentUser,
  selectTargetGroupMembers,
} from "../../redux/user/userSlice";
import ChatMessagePrivate from "./ChatMessagePrivate";
import ChatMessageGroup from "./ChatMessageGroup";
import { axios_client, loadingStatusEnum } from "../../utils";
import { serverUrl } from "../../redux/utils";

// UI //
import styles from "./ChatLogs.module.css";
import { CircularProgress } from "@mui/material";

interface Props {
  logsScrollRef: React.MutableRefObject<HTMLDivElement | null>;
  targetFriend: Friend;
  targetChatRoom: TargetChatRoom;
}

function ChatLogs({
  logsScrollRef,
  targetFriend,
  targetChatRoom,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const client = axios_client();

  const chatHistory = useSelector(selectTargetChatRoom_history);
  const currentUser = useSelector(selectCurrentUser);
  const infiniteScrollStats = useSelector(selectInfiniteScrollStats);
  const loadingStatus = useSelector(selectLoadingStatus_msg);
  const loadingStatus_2 = useSelector(selectLoadingStatus_2_msg);
  const targetGroupMembers = useSelector(
    selectTargetGroupMembers(targetChatRoom.id)
  );

  const MSG_PER_PAGE = 10;

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  useEffect(() => {
    if (infiniteScrollStats[`${targetChatRoom.type}_${targetChatRoom.id}`]) {
      setShowLoader(
        infiniteScrollStats[`${targetChatRoom.type}_${targetChatRoom.id}`]
          .hasMore && chatHistory.length >= MSG_PER_PAGE
      );
      setHasMore(
        infiniteScrollStats[`${targetChatRoom.type}_${targetChatRoom.id}`]
          .hasMore
      );
    } else {
      setHasMore(false);
    }
  }, [infiniteScrollStats, chatHistory, targetChatRoom]);

  const fetchMoreData = useCallback(async () => {
    const { type, id, date_limit } = targetChatRoom;
    const { user_id: currentUserId, username: currentUsername } = currentUser;
    const room_id = `${type}_${id}`;
    const { hasMore, pageNum } = infiniteScrollStats[`${type}_${id}`];
    if (hasMore && chatHistory.length >= MSG_PER_PAGE) {
      // have to put "chatHistory.length >= MSG_PER_PAGE" in the condition
      // otherwise, whenever user enters a room, the "fetchMoreData" will be triggered
      // even the the last element is not in view
      // I guess that the "fetchMoreData" is triggered on dataLength={chatHistory.length}
      // the <InifinteScroll /> might still used the previous chatHistory.length
      // after the room changed in the first rendering
      try {
        const { data } = await client.get<MessageObject[]>(
          serverUrl +
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
        console.log("something went wrong in fetching more chat history", err);
      }
    }
  }, [
    targetChatRoom,
    currentUser,
    dispatch,
    client,
    infiniteScrollStats,
    chatHistory.length,
  ]);

  return (
    <main className={styles.main} id="chat-board" ref={logsScrollRef}>
      <InfiniteScroll
        className={styles.logs_container}
        dataLength={chatHistory.length}
        next={fetchMoreData}
        //To put endMessage and loader to the top.
        inverse={true} //
        hasMore={hasMore}
        scrollableTarget="chat-board"
        loader={showLoader ? <CircularProgress /> : <div></div>}
      >
        {loadingStatus === loadingStatusEnum.changingTargetRoom ||
        loadingStatus_2 === loadingStatusEnum.loadChatHistory_loading ? (
          <h2>
            Loading a shitload of messages <CircularProgress />
          </h2>
        ) : targetChatRoom.type === chatType.private ? (
          chatHistory.map((msg, index) => {
            const next_msg = chatHistory[index + 1];
            const currentTime = new Date();
            return (
              <ChatMessagePrivate
                key={index}
                message={msg}
                targetFriend={targetFriend}
                currentUser={currentUser}
                currentTime={currentTime}
                next_created_at={next_msg ? next_msg.created_at : ""}
              />
            );
          })
        ) : targetGroupMembers ? (
          chatHistory.map((msg, index) => {
            const next_msg = chatHistory[index + 1];
            const currentTime = new Date();
            return (
              <ChatMessageGroup
                key={index}
                message={msg}
                group_id={targetChatRoom.id}
                targetGroupMembers={targetGroupMembers}
                currentUser={currentUser}
                currentTime={currentTime}
                next_created_at={next_msg ? next_msg.created_at : ""}
              />
            );
          })
        ) : (
          <CircularProgress />
        )}
      </InfiniteScroll>
    </main>
  );
}

export default memo(ChatLogs);
