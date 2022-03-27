import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewGroupNotification } from "../../socket-io/listeners";
import { loadingStatusEnum } from "../../utils";
import type { RootState } from "../index";

import {
  loadChatHistory_database,
  clearNotifications,
  getNotifications,
} from "./asyncThunk";

export enum chatType {
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
  warning?: boolean;
}

export interface TargetChatRoom {
  id: string; // friend_id or group_id
  name: string; // friend_name or group_name
  type: string; // private | group | public
  // if the user has left or was kicked out of a group, only show the messages on the days
  // when the user was still a member
  date_limit: string; // the Posgres timestamp
}

interface ChatHistory {
  [targetChatRoom_id: string]: MessageObject[];
}
export interface Notifications {
  [room_id: string]: { count: number; last_added_at: number };
}

interface MessageState {
  targetChatRoom: TargetChatRoom;
  chatHistory: ChatHistory;
  // need to seperate the group and friend notifications, otherwise both group and
  // frend list will be rendered every time a new notification comes in
  groupNotifications: Notifications;
  friendNotifications: Notifications;
  groupsPosition: string[];
  friendsPosition: string[];
  // add the room_type + id in the set, if the room is existed,
  // that means chat history has been loaded, then don't make request again
  // PS: cannot use Set in redux store due to non-serializable !?
  visitedRoom: { [room_id: string]: boolean };
  currentUserId_message: string;
  infiniteScrollStats: {
    [room_id: string]: { hasMore: boolean; pageNum: number };
  };
  loadingStatus: string;
}

const initialState: MessageState = {
  targetChatRoom: { id: "", name: "", type: "", date_limit: "" },
  chatHistory: {},
  groupNotifications: {},
  friendNotifications: {},
  groupsPosition: [],
  friendsPosition: [],
  visitedRoom: {},
  currentUserId_message: "",
  infiniteScrollStats: {},
  loadingStatus: loadingStatusEnum.idle,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
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
      // the infinite scroll will be broken if user re-enters a visited room
      // the local component "hasMore" and "pageNum" will be reset.
      // So each room needs to have its own chatHistory "hasMore" and "pageNum" values
      // in the store
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
      action: PayloadAction<{ messageObject: MessageObject; room_type: string }>
    ) {
      const { messageObject, room_type } = action.payload;
      const { sender_id, recipient_id } = messageObject;
      const currentUserId = state.currentUserId_message;

      const userIsInChatRoom = `${state.targetChatRoom.type}_${state.targetChatRoom.id}`;
      // since this listener handles all types of live messages
      // have to figure out which room the live message is belonged to
      let room_id = "";
      if (room_type === chatType.private) {
        if (sender_id === currentUserId) {
          // when the current user is the sender, then the recipient_id is the room_id
          room_id = `${room_type}_${recipient_id}`;
          // reposition the friend in the order of latest notification
          // both sender and recipient should push the latest chat to top
          state.friendsPosition = pushPositionToTop(
            state.friendsPosition,
            recipient_id
          );
        } else {
          // when the current user is the recipient, then then sender_id is the room_id
          room_id = `${room_type}_${sender_id}`;
          // reposition the friend in the order of latest notification
          state.friendsPosition = pushPositionToTop(
            state.friendsPosition,
            sender_id
          );
        }
        // update the live message notification for private chat room
        // only show notification if user is not in the target room
        if (!state.friendNotifications[room_id]) {
          state.friendNotifications[room_id] = { count: 0, last_added_at: 0 };
        }
        if (userIsInChatRoom !== room_id) {
          state.friendNotifications[room_id].count += 1;
          state.friendNotifications[room_id].last_added_at = Date.now();
        }
      } else {
        // all group rooms are always the recipient
        room_id = `${room_type}_${recipient_id}`;
        state.groupsPosition = pushPositionToTop(
          state.groupsPosition,
          recipient_id
        );
        // update the live message notification for private or group chat rooms
        if (!state.groupNotifications[room_id]) {
          state.groupNotifications[room_id] = { count: 0, last_added_at: 0 };
        }

        if (userIsInChatRoom !== room_id) {
          state.groupNotifications[room_id].count += 1;
          state.groupNotifications[room_id].last_added_at = Date.now();
        }
      }

      // add message to chat history for the specific room
      if (!state.chatHistory[room_id]) {
        state.chatHistory[room_id] = [];
      }
      state.chatHistory[room_id].unshift(messageObject);
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

    resetVisitedRoom(
      state,
      action: PayloadAction<{ room_id: string; visited: boolean }>
    ): void {
      const { room_id, visited } = action.payload;
      state.visitedRoom[room_id] = visited;
      state.chatHistory[room_id] = [];
      state.infiniteScrollStats[room_id] = {
        hasMore: true,
        pageNum: 2,
      };
    },

    setLoadingStatus_msg(state, action: PayloadAction<string>) {
      state.loadingStatus = action.payload;
    },

    updateGroupNote_afterJoining(
      state,
      action: PayloadAction<NewGroupNotification>
    ) {
      // push the new group to top by adding the new notification
      const note = action.payload;
      let target_id = `${chatType.group}_${note.group_id}`;
      if (!state.groupNotifications[target_id]) {
        state.groupNotifications[target_id] = {
          count: 0,
          last_added_at: 0,
        };
        // if this is a new group, push the new group_id to the position array
        // otherwise, do nothing, since user who got kicked or left can join in the same group
        state.groupsPosition.push(note.group_id);
      }
      state.groupNotifications[target_id].count = note.count;
      state.groupNotifications[target_id].last_added_at = new Date(
        note.last_added_at
      ).getTime();

      // use the sort to initialize the position of Groups by the lastest notification
      state.groupsPosition = sortByLastAdded(
        state.groupsPosition,
        state.groupNotifications,
        chatType.group
      );
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
        // initialize the private chat notification
        state.friendsPosition = [];
        action.payload.private.forEach((note) => {
          let target_id = `${chatType.private}_${note.sender_id}`;
          if (!state.friendNotifications[target_id]) {
            state.friendNotifications[target_id] = {
              count: 0,
              last_added_at: 0,
            };
          }
          state.friendNotifications[target_id].count = note.count;
          state.friendNotifications[target_id].last_added_at = new Date(
            note.last_added_at
          ).getTime();
          state.friendsPosition.push(note.sender_id);
        });
        // use the sort to initialize the position of Friends by the lastest notification
        state.friendsPosition = sortByLastAdded(
          state.friendsPosition,
          state.friendNotifications,
          chatType.private
        );

        // initialize the group chat notification
        state.groupsPosition = [];
        action.payload.group.forEach((note) => {
          let target_id = `${chatType.group}_${note.group_id}`;
          if (!state.groupNotifications[target_id]) {
            state.groupNotifications[target_id] = {
              count: 0,
              last_added_at: 0,
            };
          }
          state.groupNotifications[target_id].count = note.count;
          state.groupNotifications[target_id].last_added_at = new Date(
            note.last_added_at
          ).getTime();
          state.groupsPosition.push(note.group_id);
        });
        // use the sort to initialize the position of Groups by the lastest notification
        state.groupsPosition = sortByLastAdded(
          state.groupsPosition,
          state.groupNotifications,
          chatType.group
        );
      })

      /***************  Clear Notifications  ***************/
      .addCase(clearNotifications.fulfilled, (state, action): void => {
        const { type, id } = action.payload;
        if (type === chatType.group) {
          if (!state.groupNotifications[`${type}_${id}`]) return;
          state.groupNotifications[`${type}_${id}`].count = 0;
        } else {
          if (!state.friendNotifications[`${type}_${id}`]) return;
          state.friendNotifications[`${type}_${id}`].count = 0;
        }
      });
  },
});

export const {
  setTargetChatRoom,
  addNewMessageToHistory_memory,
  loadMoreOldChatHistory_database,
  setCurrentUserId_message,
  setInfiniteScrollStats,
  resetVisitedRoom,
  setLoadingStatus_msg,
  updateGroupNote_afterJoining,
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
export const selectGroupNotifications = createSelector(
  [selectMessageState],
  (messageState) => messageState.groupNotifications
);
export const selectFriendNotifications = createSelector(
  [selectMessageState],
  (messageState) => messageState.friendNotifications
);
export const selectInfiniteScrollStats = createSelector(
  [selectMessageState],
  (messageState) => messageState.infiniteScrollStats
);
export const selectFriendsPosition = createSelector(
  [selectMessageState],
  (messageState) => messageState.friendsPosition
);
export const selectGroupsPosition = createSelector(
  [selectMessageState],
  (messageState) => messageState.groupsPosition
);
export const selectLoadingStatus_msg = createSelector(
  [selectMessageState],
  (userState) => userState.loadingStatus
);
export const selectTotalGroupNoteCount = createSelector(
  [selectGroupsPosition, selectGroupNotifications],
  (positions, notes) => {
    const totalCount = positions.reduce((x, y) => {
      const room_id = `${chatType.group}_${y}`;
      if (!notes[room_id]) {
        return (x = x + 0);
      }
      console.log("total", x);
      return (x = x + notes[room_id].count);
    }, 0);
    return totalCount;
  }
);
export const selectTotalFriendNoteCount = createSelector(
  [selectFriendsPosition, selectFriendNotifications],
  (positions, notes) => {
    const totalCount = positions.reduce((x, y) => {
      const room_id = `${chatType.private}_${y}`;
      if (!notes[room_id]) {
        return (x = x + 0);
      }
      console.log("total", x);
      return (x = x + notes[room_id].count);
    }, 0);
    return totalCount;
  }
);

// the user/group with the lastest notification will be on top of the list
function sortByLastAdded(
  position: string[],
  notifications: Notifications,
  type: string
): string[] {
  // JS default sorting should be O(n log n)
  position.sort((id_1, id_2) => {
    if (
      notifications[`${type}_${id_1}`].last_added_at <
      notifications[`${type}_${id_2}`].last_added_at
    ) {
      return 1;
    } else {
      return -1;
    }
  });
  return position;
}

function pushPositionToTop(position: string[], target_id: string): string[] {
  // array.slice takes O(n), array.indexof takes O(n)
  // Cannot use binary-search on position array since the ids are not sorted
  // it should be more efficient than using array.sort() for the newly added notification
  const targetIndex = position.indexOf(target_id);
  const newPosition = [target_id];
  newPosition.push(...position.slice(0, targetIndex));
  newPosition.push(...position.slice(targetIndex + 1));

  return newPosition;
}
