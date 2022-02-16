import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

import { loadChatHistory_database } from "./asyncThunk/load-chat-history";
import { clearNotifications } from "./asyncThunk/clear-notifications";
import { getNotifications } from "./asyncThunk/get-notifications";

export enum chatType {
  public = "public",
  group = "group",
  private = "private",
}
export enum msgType {
  text = "text",
  image = "image",
  file = "file",
}

export interface MessageObject {
  sender_id: string;
  sender_name: string;
  recipient_id: string;
  recipient_name: string;
  msg_body: string;
  msg_type: string;
  created_at: string;
  file_url?: string;
  file_type?: string;
  file_name?: string;
  file_localUrl?: string;
}

export interface RoomType {
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

    addNewMessageToHistory_memory(
      state,
      action: PayloadAction<MessageObject & RoomType>
    ) {
      const {
        sender_id,
        sender_name,
        recipient_id,
        recipient_name,
        msg_body,
        msg_type,
        file_name,
        file_url,
        file_localUrl,
        created_at,
        targetChatRoom_type,
      } = action.payload;

      const currentUserId = state.currentUserId_message;

      let room_id = "";
      if (targetChatRoom_type === chatType.private) {
        if (sender_id === currentUserId) {
          // the current user is the sender
          room_id = `${targetChatRoom_type}_${recipient_id}`;
        } else {
          // the current user is the recipient
          room_id = `${targetChatRoom_type}_${sender_id}`;
        }
      } else if (targetChatRoom_type === chatType.group) {
        room_id = `${targetChatRoom_type}_${recipient_id}`;
      } else {
      }

      // add message to chat history for the specific room
      if (!state.chatHistory[room_id]) {
        state.chatHistory[room_id] = [];
      }

      state.chatHistory[room_id].unshift({
        sender_id,
        sender_name,
        recipient_id,
        recipient_name,
        msg_body,
        msg_type,
        file_name,
        file_localUrl,
        file_url,
        created_at,
      });

      // increament notification count for the specific room
      // only show notification if user is not in the target room and user is the recipient
      if (!state.messageNotifications[room_id]) {
        state.messageNotifications[room_id] = 0;
      }
      const userIsInChatRoom = `${state.targetChatRoom.type}_${state.targetChatRoom.id}`;
      if (currentUserId === recipient_id && userIsInChatRoom !== room_id)
        state.messageNotifications[room_id] += 1;
    },

    loadMoreOldChatHistory_database(
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

      const oldChatHistoy: MessageObject[] = chatHistory.map((msg) => {
        return {
          sender_id: msg.sender_id,
          sender_name:
            msg.sender_id === currentUserId ? currentUsername : friendName,
          recipient_id: msg.recipient_id,
          recipient_name:
            msg.recipient_id === currentUserId ? currentUsername : friendName,
          msg_body: msg.msg_body,
          msg_type: msg.msg_type,
          file_name: msg.file_name,
          file_url: msg.file_url,
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
    builder
      ///////////////////////
      // Load Chat History //
      ///////////////////////
      .addCase(loadChatHistory_database.fulfilled, (state, action): void => {
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
            sender_name:
              msg.sender_id === currentUserId ? currentUsername : name,
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
      })
      ///////////////////////
      // Get Notifications //
      ///////////////////////
      .addCase(getNotifications.fulfilled, (state, action): void => {
        action.payload.private.forEach((note) => {
          state.messageNotifications[`${chatType.private}_${note.sender_id}`] =
            note.count;
        });
        // action.payload.group.forEach(note=>{
        //   state.messageNotifications[`${chatType.private}_${note.sender_id}`] = note.count
        // })
      })
      /////////////////////////
      // Clear Notifications //
      /////////////////////////
      .addCase(clearNotifications.fulfilled, (state, action): void => {
        const { type, id } = action.payload;
        state.messageNotifications[`${type}_${id}`] = 0;
      });
  },
});

export const {
  setTargetChatRoom,
  addNewMessageToHistory_memory,
  loadMoreOldChatHistory_database,
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
