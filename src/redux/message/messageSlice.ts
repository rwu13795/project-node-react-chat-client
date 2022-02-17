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
  infiniteScrollStats: {
    [room_id: string]: { hasMore: boolean; pageNum: number };
  };
}

const initialState: MessageState = {
  targetChatRoom: { id: "", name: "", type: "" },
  chatHistory: {},
  messageNotifications: {},
  visitedRoom: {},
  currentUserId_message: "",
  infiniteScrollStats: {},
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
      const { type, id } = action.payload;
      // initialize the infiniteScrollStats whenever user enters a room
      if (!state.infiniteScrollStats[`${type}_${id}`]) {
        state.infiniteScrollStats[`${type}_${id}`] = {
          hasMore: true,
          pageNum: 2,
        };
      }
    },

    setInfiniteScrollStats(
      state,
      action: PayloadAction<{ hasMore?: boolean; pageNum?: number }>
    ): void {
      // the infinite scroll will be broken if user re-enters the a visited room
      // the "hasMore" and "pageNum" will be reset.
      //So each room needs to have its own chatHistory "hasMore" and "pageNum" values
      const { hasMore, pageNum } = action.payload;
      const { type, id } = state.targetChatRoom;
      if (hasMore !== undefined) {
        state.infiniteScrollStats[`${type}_${id}`].hasMore = hasMore;
      }
      if (pageNum !== undefined) {
        state.infiniteScrollStats[`${type}_${id}`].pageNum = pageNum;
      }
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

      // since this listener handles all types of live messages
      // have to figure out which room the live message is belonged to
      let room_id = "";
      if (targetChatRoom_type === chatType.private) {
        // for private_messages
        // for exmaple, if user=1 is sends a message, then the sender_id=1 will be the
        // the room_id. if the current user sends a message to user=5, then the
        // recipient_id=5 will be the room_id
        if (sender_id === currentUserId) {
          // when the current user is the sender, then the recipient_id is the room_id
          room_id = `${targetChatRoom_type}_${recipient_id}`;
        } else {
          // when the current user is the recipient, then then sender_id is the room_id
          room_id = `${targetChatRoom_type}_${sender_id}`;
        }
      } else {
        // all public and group rooms will always be the recipient
        room_id = `${targetChatRoom_type}_${recipient_id}`;
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

      // update the live message notification for private or group chat rooms
      if (!state.messageNotifications[room_id]) {
        state.messageNotifications[room_id] = 0;
      }
      const userIsInChatRoom = `${state.targetChatRoom.type}_${state.targetChatRoom.id}`;
      // only show notification if user is not in the target room
      if (userIsInChatRoom !== room_id) {
        state.messageNotifications[room_id] += 1;
      }
    },

    loadMoreOldChatHistory_database(
      state,
      action: PayloadAction<{
        chatHistory: MessageObject[];
        room_id: string;
        currentUserId: string;
        currentUsername: string;
      }>
    ) {
      const { room_id, currentUserId, currentUsername, chatHistory } =
        action.payload;
      const friendName = state.targetChatRoom.name;

      // since the target room is specified when the user clicks on the room
      // no need to figure out what the room_id is , like I did in
      // the addNewMessageToHistory_memory
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
      /***************  Load Chat History  ***************/
      .addCase(loadChatHistory_database.fulfilled, (state, action): void => {
        const currentUsername = action.payload.currentUsername;
        const currentUserId = action.payload.currentUserId;
        const { type, id, name } = state.targetChatRoom;

        const chatHistory = action.payload.chatHistory;

        if (action.payload.wasHistoryLoaded) return;

        // map the chat history for different room_type `${type}_${id}`
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

      /***************  Get Notifications  ***************/
      .addCase(getNotifications.fulfilled, (state, action): void => {
        action.payload.private.forEach((note) => {
          state.messageNotifications[`${chatType.private}_${note.sender_id}`] =
            note.count;
        });
        action.payload.group.forEach((note) => {
          state.messageNotifications[`${chatType.group}_${note.group_id}`] =
            note.count;
        });
      })
      /***************  Clear Notifications  ***************/
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
  setInfiniteScrollStats,
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

// whenever there is change in targetChatRoom, this selector will be triggered again
// since the "selectTargetChatRoom" is one of the selectors. the new chatHistory
// will be diplayed in the <ChatBoard />
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
export const selectInfiniteScrollStats = createSelector(
  [selectMessageState],
  (messageState) => messageState.infiniteScrollStats
);
