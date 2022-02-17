import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../..";
import { client, serverUrl } from "../../utils";

interface MessageObject_res {
  msg_body: string;
  msg_type: string;
  created_at: string;
  recipient_id: string;
  sender_id: string;
  file_type: string;
  file_name: string;
  file_url: string;
}
interface LoadChatHistory_res {
  chatHistory: MessageObject_res[];
  currentUsername: string;
  currentUserId: string;
  wasHistoryLoaded: boolean;
}
interface LoadChatHistory_req {
  targetRoom_type: string;
  targetRoom_id: string;
  currentUserId: string;
}

// load the last 20 chat messages when the user clicks on the target room
// if user wants to read more old messages, the "infinite scroll" will be
// used to fetch more old messages. and the messages will be merged into
// the chatHistory by using "loadMoreOldChatHistory"
export const loadChatHistory_database = createAsyncThunk<
  LoadChatHistory_res,
  LoadChatHistory_req,
  { state: RootState }
>(
  "message/loadChatHistory",
  async ({ targetRoom_type, targetRoom_id, currentUserId }, thunkAPI) => {
    // id can be user's, group's or public-channel's id
    const room_id = `${targetRoom_type}_${targetRoom_id}`;
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

    console.log("currentUserId", currentUserId);

    const currentUsername = thunkAPI.getState().user.currentUser.username;
    const response = await client.get<MessageObject_res[]>(
      serverUrl +
        `/chat/chat-history?id_1=${currentUserId}&id_2=${targetRoom_id}&type=${targetRoom_type}`
    );
    return {
      chatHistory: response.data,
      currentUsername,
      currentUserId,
      wasHistoryLoaded: false,
    };
  }
);
