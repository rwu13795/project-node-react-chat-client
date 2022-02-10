import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../..";
import { client, serverUrl } from "../../utils";

interface chatHistory_res {
  body: string;
  created_at: string;
  recipient_id: string;
  sender_id: string;
}
interface LoadChatHistory_res {
  chatHistory: chatHistory_res[];
  currentUsername: string;
  currentUserId: string;
  wasHistoryLoaded: boolean;
}
interface LoadChatHistory_req {
  type: string;
  id: string;
  currentUserId: string;
}

// load the last 20 chat messages when the user clicks on the target room
// if user wants to read more old messages, the "infinite scroll" will be
// used to fetch more old messages. and the messages will be merged into
// the chatHistory by using "loadMoreOldChatHistory"
export const loadChatHistory = createAsyncThunk<
  LoadChatHistory_res,
  LoadChatHistory_req,
  { state: RootState }
>("message/loadChatHistory", async ({ type, id, currentUserId }, thunkAPI) => {
  const room_id = `${type}_${id}`;
  // if the room is visited, that means chat history has been loaded, then don't make request again
  if (thunkAPI.getState().message.visitedRoom[room_id]) {
    console.log("visied room");
    return {
      chatHistory: [],
      currentUsername: "",
      currentUserId: "",
      wasHistoryLoaded: true,
    };
  }

  const currentUsername = thunkAPI.getState().user.currentUser.username;
  const response = await client.get<chatHistory_res[]>(
    serverUrl + `/chat/private-chat-history?id_1=${currentUserId}&id_2=${id}`
  );
  return {
    chatHistory: response.data,
    currentUsername,
    currentUserId,
    wasHistoryLoaded: false,
  };
});
