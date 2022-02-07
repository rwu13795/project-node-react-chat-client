/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import browserClient from "../../utils/axios-client";
import { loadMoreOldChatHistory, MessageObject } from "../redux/messageSlice";

const serverUrl = "http://localhost:5000/api";

export default function useLoadMoreMessages(
  // chatHistory_start:  MessageObject[],
  pageNum: number,
  room_id: string,
  room_type: string,
  currentUserId: string,
  currentUsername: string
) {
  const MSG_PER_PAGE = 10;
  const room_identifier = `${room_type}_${room_id}`;
  const client = browserClient();
  const dispatch = useDispatch();

  //   const [chatHistory, setChatHistory] = useState<MessageObject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // have to reset the products when the startProducts were changed
  // (when other sub-cat products are being rendered)

  const fetchMoreData = useCallback(async () => {
    if (hasMore) {
      console.log("page num", pageNum);

      try {
        const { data } = await client.get<MessageObject[]>(
          serverUrl +
            `/chat/private-chat-history?id_1=${currentUserId}&id_2=${room_id}&page=${pageNum}`
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
      } catch (err) {
        console.log("something went wrong in fetching! ", err);
      }
    }
  }, [hasMore, room_id, room_type, pageNum]);

  useEffect(() => {
    if (pageNum > 1) {
      setIsLoading(true);
      fetchMoreData();
      setIsLoading(false);
      return;
    }
  }, [pageNum]);

  return { isLoading, hasMore };
}
