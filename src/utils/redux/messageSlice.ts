import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "./index";

import axios_client from "../axios-client";

export enum chatType {
  public = "public",
  group = "group",
  private = "private",
}

export interface MessageObject {
  sender_id: string;
  sender_username: string;
  recipient_id: string;
  recipient_username: string;
  body: string;
  created_at: string;
}
export interface RoomIdentifier {
  targetChatRoom_type: string;
  currentUserId?: string;
}
export interface TargetChatRoom {
  id: string;
  name: string;
  type: string;
}

interface ChatHistory {
  [targetChatRoom_id: string]: MessageObject[];
}

interface chatHistory_response {
  body: string;
  created_at: string;
  recipient_id: string;
  sender_id: string;
}

interface LoadChatHistory {
  chatHistory: chatHistory_response[];
  currentUsername: string;
  currentUserId: string;
  wasHistoryLoaded: boolean;
}

interface MessageState {
  targetChatRoom: TargetChatRoom;
  chatHistory: ChatHistory;
  // add the room_type + id in the set, if the room is existed,
  // that means chat history has been loaded, then don't make request again
  // PS: cannot use Set in redux store due to non-serializable !?
  visitedRoom: { [room_name: string]: boolean };
}

const initialState: MessageState = {
  targetChatRoom: { id: "", name: "", type: "" },
  chatHistory: {},
  visitedRoom: {},
};

const client = axios_client();
//   const serverUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}`;
const serverUrl = "http://localhost:5000/api";

const loadChatHistory = createAsyncThunk<
  LoadChatHistory,
  string,
  { state: RootState }
>("message/loadChatHistory", async (currentUserId, thunkAPI) => {
  const { type, id } = thunkAPI.getState().message.targetChatRoom;
  const visitedRoom = `${type}_${id}`;

  // if the room is visited, that means chat history has been loaded, then don't make request again
  if (thunkAPI.getState().message.visitedRoom[visitedRoom]) {
    console.log("visied room");
    return {
      chatHistory: [],
      currentUsername: "",
      currentUserId: "",
      wasHistoryLoaded: true,
    };
  }

  const currentUsername = thunkAPI.getState().user.currentUser.username;
  const response = await client.get<chatHistory_response[]>(
    serverUrl + `/chat/private-chat-history?id_1=${currentUserId}&id_2=${id}`
  );
  return {
    chatHistory: response.data,
    currentUsername,
    currentUserId,
    wasHistoryLoaded: false,
  };
});

////////////////////////////////////////////////////////////////////////////////

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    //   clearAuthErrors(state, action: PayloadAction<string>) {
    //     if (action.payload === "all") {
    //       state.authErrors = {};
    //     } else {
    //       state.authErrors[action.payload] = "";
    //     }
    //   },

    setTargetChatRoom(state, action: PayloadAction<TargetChatRoom>): void {
      state.targetChatRoom = action.payload;
      if (state.visitedRoom[`${action.payload.type}_${action.payload.id}`]) {
        return;
      }
      if (!state.chatHistory[`${action.payload.type}_${action.payload.id}`]) {
        state.visitedRoom[`${action.payload.type}_${action.payload.id}`] =
          false;
      } else {
        state.visitedRoom[`${action.payload.type}_${action.payload.id}`] = true;
      }
    },

    setChatHistory(
      state,
      action: PayloadAction<MessageObject & RoomIdentifier>
    ) {
      const {
        sender_id,
        sender_username,
        recipient_id,
        recipient_username,
        body,
        created_at,
        targetChatRoom_type,
        currentUserId,
      } = action.payload;

      // the current user is the recipient
      let room_id = `${targetChatRoom_type}_${sender_id}`;
      // the current user is the sender
      if (sender_id === currentUserId) {
        room_id = `${targetChatRoom_type}_${recipient_id}`;
      }
      if (!state.chatHistory[room_id]) {
        state.chatHistory[room_id] = [];
      }
      state.chatHistory[room_id].push({
        sender_id,
        sender_username,
        recipient_id,
        recipient_username,
        body,
        created_at,
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadChatHistory.fulfilled, (state, action): void => {
      const currentUsername = action.payload.currentUsername;
      const currentUserId = action.payload.currentUserId;
      const friendName = state.targetChatRoom.name;
      const friendId = state.targetChatRoom.id;
      const chatHistory = action.payload.chatHistory;

      if (action.payload.wasHistoryLoaded) return;

      state.chatHistory[`private_${friendId}`] = chatHistory.map((msg) => {
        return {
          sender_id: msg.sender_id,
          sender_username:
            msg.sender_id === currentUserId ? currentUsername : friendName,
          recipient_id: msg.recipient_id,
          recipient_username:
            msg.recipient_id === currentUserId ? currentUsername : friendName,
          body: msg.body,
          created_at: msg.created_at,
        };
      });
    });
  },

  // .addCase(
  //   signIn.fulfilled,
  //   (state, action: PayloadAction<UserState>): void => {
  //     state.currentUser = action.payload.currentUser;
  //     state.friendsList = action.payload.friendsList;
  //     state.loadingStatus = "succeeded";
  //   }
  // )
  // .addCase(signIn.pending, (state): void => {
  //   state.loadingStatus = "loading";
  // })
  // .addCase(signIn.rejected, (state, action: PayloadAction<any>): void => {
  //   for (let err of action.payload.errors) {
  //     state.authErrors[err.field] = err.message;
  //   }
  //   state.loadingStatus = "failed";
  //   // state.pageLoading_user = false;
  // })
});

export const { setTargetChatRoom, setChatHistory } = messageSlice.actions;

export { loadChatHistory };

export default messageSlice.reducer;

// NOTE from Redux Docs //
// In typical Reselect usage, you write your top-level "input selectors" as plain functions,
// and use createSelector to create memoized selectors that look up nested value
const selectMessageState = (state: RootState) => state.message;
const selectChatHistory = createSelector(
  [selectMessageState],
  (messageState) => messageState.chatHistory
);

export const selectTargetChatRoom = createSelector(
  [selectMessageState],
  (messageState) => messageState.targetChatRoom
);

export const selectTargetChatRoom_history = createSelector(
  [selectChatHistory, selectTargetChatRoom],
  (history, { id, type }) => {
    let room_id = `${type}_${id}`;
    return history[room_id] ? history[room_id] : [];
  }
);
