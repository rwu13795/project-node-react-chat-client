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
}
export interface TargetChatRoom {
  id: string; // friend_id or group_id
  name: string; // friend_name or group_name
  type: string; // private | group | public
}

interface ChatHistory {
  [targetChatRoom_id: string]: MessageObject[];
}

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

interface PrivateNotifications {
  sender_id: string;
  count: number;
}
interface GetNotifications_res {
  private: PrivateNotifications[];
  group: string[];
}

interface MessageState {
  targetChatRoom: TargetChatRoom;
  chatHistory: ChatHistory;
  messageNotifications: { [room_id: string]: number };
  // add the room_type + id in the set, if the room is existed,
  // that means chat history has been loaded, then don't make request again
  // PS: cannot use Set in redux store due to non-serializable !?
  visitedRoom: { [room_id: string]: boolean };
  currentUserId_message: string;
}

const initialState: MessageState = {
  targetChatRoom: { id: "", name: "", type: "" },
  chatHistory: {},
  messageNotifications: {},
  visitedRoom: {},
  currentUserId_message: "",
};

const client = axios_client();
//   const serverUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}`;
const serverUrl = "http://localhost:5000/api";

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

export const getNotifications = createAsyncThunk<
  GetNotifications_res,
  string,
  { state: RootState }
>("message/getNotifications", async (currentUserId) => {
  const response = await client.get<GetNotifications_res>(
    serverUrl + `/chat/get-notifications?user_id=${currentUserId}`
  );
  return response.data;
});

export const clearNotifications = createAsyncThunk<
  { type: string; id: string },
  { type: string; id: string },
  { state: RootState }
>("message/clearNotifications", async ({ type, id }, thunkAPI) => {
  const user_id = thunkAPI.getState().user.currentUser.user_id;
  await client.post(serverUrl + `/chat/clear-notifications`, {
    type,
    target_id: id,
    user_id,
  });

  return { type, id };
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
    setCurrentUserId_message(state, action: PayloadAction<string>): void {
      state.currentUserId_message = action.payload;
    },
    setTargetChatRoom(state, action: PayloadAction<TargetChatRoom>): void {
      state.targetChatRoom = action.payload;
    },

    addNewMessageToHistory(
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
      } = action.payload;

      const currentUserId = state.currentUserId_message;

      const room_id =
        sender_id === currentUserId
          ? // the current user is the sender
            `${targetChatRoom_type}_${recipient_id}`
          : // the current user is the recipient
            `${targetChatRoom_type}_${sender_id}`;

      // add message to chat history for the specific room
      if (!state.chatHistory[room_id]) {
        state.chatHistory[room_id] = [];
      }
      state.chatHistory[room_id].unshift({
        sender_id,
        sender_username,
        recipient_id,
        recipient_username,
        body,
        created_at,
      });

      // increament notification count for the specific room
      if (!state.messageNotifications[room_id]) {
        state.messageNotifications[room_id] = 0;
      }

      // only show notification if user is not in the target room and user is the recipient
      const chatRoomUserIsIn = `${state.targetChatRoom.type}_${state.targetChatRoom.id}`;
      if (currentUserId === recipient_id && chatRoomUserIsIn !== room_id)
        state.messageNotifications[room_id] += 1;
    },

    loadMoreOldChatHistory(
      state,
      action: PayloadAction<{
        chatHistory: MessageObject[];
        room_id: string;
        currentUserId: string;
        currentUsername: string;
        room_type: string;
      }>
    ) {
      const {
        room_id,
        currentUserId,
        currentUsername,
        chatHistory,
        room_type,
      } = action.payload;
      const friendName = state.targetChatRoom.name;

      // map the chat history for different room_type
      if (room_type) {
      }

      const oldChatHistoy = chatHistory.map((msg) => {
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

      state.chatHistory[room_id] = [
        ...state.chatHistory[room_id],
        ...oldChatHistoy,
      ];
    },
  },

  extraReducers: (builder) => {
    // load the last 20 chat messages when the user clicks on the target room
    // if user wants to read more old messages, the "infinite scroll" will be
    // used to fetch more old messages. and the messages will be merged into
    // the chatHistory by using "loadMoreOldChatHistory"
    builder
      .addCase(loadChatHistory.fulfilled, (state, action): void => {
        const currentUsername = action.payload.currentUsername;
        const currentUserId = action.payload.currentUserId;
        const { type, id, name } = state.targetChatRoom;

        const chatHistory = action.payload.chatHistory;

        if (action.payload.wasHistoryLoaded) return;

        // map the chat history for different room_type
        if (type === "") {
        }

        state.chatHistory[`${type}_${id}`] = chatHistory.map((msg) => {
          return {
            sender_id: msg.sender_id,
            sender_username:
              msg.sender_id === currentUserId ? currentUsername : name,
            recipient_id: msg.recipient_id,
            recipient_username:
              msg.recipient_id === currentUserId ? currentUsername : name,
            body: msg.body,
            created_at: msg.created_at,
          };
        });

        // set this room as visited, so it won't fetch message from server again unless
        // the user is scrolling up for older messages
        state.visitedRoom[`${type}_${id}`] = true;
      })

      /////////////// getNotifications///////////

      .addCase(getNotifications.fulfilled, (state, action): void => {
        action.payload.private.forEach((note) => {
          state.messageNotifications[`${chatType.private}_${note.sender_id}`] =
            note.count;
        });
        // action.payload.group.forEach(note=>{
        //   state.messageNotifications[`${chatType.private}_${note.sender_id}`] = note.count
        // })
      })

      .addCase(clearNotifications.fulfilled, (state, action): void => {
        const { type, id } = action.payload;
        state.messageNotifications[`${type}_${id}`] = 0;
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

export const {
  setTargetChatRoom,
  addNewMessageToHistory,
  loadMoreOldChatHistory,
  setCurrentUserId_message,
} = messageSlice.actions;

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
export const selectMessageNotifications = createSelector(
  [selectMessageState],
  (messageState) => messageState.messageNotifications
);
