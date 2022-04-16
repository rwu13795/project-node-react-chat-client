import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";

import { RootState } from "../..";
import { axios_client, loadingStatusEnum } from "../../../utils";
import { serverUrl } from "../../utils";
import { MessageState } from "../messageSlice";

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
interface Payload {
  chatHistory: MessageObject_res[];
  currentUsername: string;
  currentUserId: string;
  wasHistoryLoaded: boolean;
}
interface Res_body {
  targetRoom_type: string;
  targetRoom_id: string;
  currentUserId: string;
  date_limit?: string;
}

// load the last 20 chat messages when the user clicks on the target room
// if user wants to read more old messages, the "infinite scroll" will be
// used to fetch more old messages. and the messages will be merged into
// the chatHistory by using "loadMoreOldChatHistory"
export const loadChatHistory_database = createAsyncThunk<
  Payload,
  Res_body,
  { state: RootState }
>(
  "message/loadChatHistory",
  async (
    { targetRoom_type, targetRoom_id, currentUserId, date_limit },
    thunkAPI
  ) => {
    const client = axios_client();

    // id can be user's, group's or public-channel's id
    const room_id = `${targetRoom_type}_${targetRoom_id}`;
    // if the room is visited, that means chat history has been loaded, then don't make request again
    if (thunkAPI.getState().message.visitedRoom[room_id]) {
      return {
        chatHistory: [],
        currentUsername: "",
        currentUserId: "",
        wasHistoryLoaded: true,
      };
    }

    if (!date_limit) date_limit = "";
    const currentUsername = thunkAPI.getState().user.currentUser.username;
    const response = await client.get<MessageObject_res[]>(
      serverUrl +
        `/chat/chat-history?id_1=${currentUserId}&id_2=${targetRoom_id}&type=${targetRoom_type}&date_limit=${date_limit}`
    );
    return {
      chatHistory: response.data,
      currentUsername,
      currentUserId,
      wasHistoryLoaded: false,
    };
  }
);

export function loadChatHistory_database_fulfilled(
  state: WritableDraft<MessageState>,
  action: PayloadAction<Payload>
) {
  const currentUsername = action.payload.currentUsername;
  const currentUserId = action.payload.currentUserId;
  const { type, id, name } = state.targetChatRoom;

  const chatHistory = action.payload.chatHistory;

  if (action.payload.wasHistoryLoaded) {
    state.loadingStatus_2 = loadingStatusEnum.idle;
    return;
  }

  // map the chat history for different room_type `${type}_${id}`
  state.chatHistory[`${type}_${id}`] = chatHistory.map((msg) => {
    return {
      sender_id: msg.sender_id,
      sender_name: msg.sender_id === currentUserId ? currentUsername : name,
      recipient_id: msg.recipient_id,
      recipient_name:
        msg.recipient_id === currentUserId ? currentUsername : name,
      msg_body: msg.msg_body,
      msg_type: msg.msg_type,
      file_name: msg.file_name,
      file_url: msg.file_url,
      file_type: msg.file_type,
      created_at: msg.created_at,
    };
  });
  // set this room as visited, so it won't fetch message from server again unless
  // the user is scrolling up for older messages
  state.visitedRoom[`${type}_${id}`] = true;

  state.loadingStatus_2 = loadingStatusEnum.idle;
}

export function loadChatHistory_database_pending(
  state: WritableDraft<MessageState>
) {
  state.loadingStatus_2 = loadingStatusEnum.loadChatHistory_loading;
}
