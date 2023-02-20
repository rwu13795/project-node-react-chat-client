import { createSelector, createSlice } from "@reduxjs/toolkit";
import { loadingStatusEnum } from "../../utils";
import type { RootState } from "../index";

import * as asyncThunk from "./asyncThunk";
import * as reducers from "./reducers";

export enum chatType {
  group = "group",
  private = "private",
}
export enum msgType {
  text = "text",
  image = "image",
  file = "file",
  admin = "admin",
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

export interface MessageState {
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
  loadingStatus_2: string;
}

export const initialState_msg: MessageState = {
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
  loadingStatus_2: loadingStatusEnum.idle,
};

const messageSlice = createSlice({
  name: "message",
  initialState: initialState_msg,
  reducers: {
    setCurrentUserId_msg: reducers.setCurrentUserId_msg_reducer,

    setTargetChatRoom: reducers.setTargetChatRoom_reducer,

    setInfiniteScrollStats: reducers.setInfiniteScrollStats_reducer,

    addNewMessageToHistory_memory:
      reducers.addNewMessageToHistory_memory_reducer,

    loadMoreOldChatHistory_database:
      reducers.loadMoreOldChatHistory_database_reducer,

    resetVisitedRoom: reducers.resetVisitedRoom_reducer,

    setLoadingStatus_msg: reducers.setLoadingStatus_msg_reducer,

    setLoadingStatus_2_msg: reducers.setLoadingStatus_2_msg_reducer,

    updateGroupNote_afterJoining: reducers.updateGroupNote_afterJoining_reducer,

    resetAfterSignOut_msg: reducers.resetAfterSignOut_msg_reducer,

    removeGroupPosition: reducers.removeGroupPosition_reducer,
  },

  extraReducers: (builder) => {
    builder
      /***************  Load Chat History  ***************/
      .addCase(
        asyncThunk.loadChatHistory_database.fulfilled,
        asyncThunk.loadChatHistory_database_fulfilled
      )
      .addCase(
        asyncThunk.loadChatHistory_database.pending,
        asyncThunk.loadChatHistory_database_pending
      )

      /***************  Get Notifications  ***************/
      .addCase(
        asyncThunk.getNotifications.fulfilled,
        asyncThunk.getNotifications_fulfilled
      )

      /***************  Clear Notifications  ***************/
      .addCase(
        asyncThunk.clearNotifications.fulfilled,
        asyncThunk.clearNotifications_fulfilled
      );
  },
});

export const {
  setTargetChatRoom,
  addNewMessageToHistory_memory,
  loadMoreOldChatHistory_database,
  setCurrentUserId_msg,
  setInfiniteScrollStats,
  resetVisitedRoom,
  setLoadingStatus_msg,
  setLoadingStatus_2_msg,
  updateGroupNote_afterJoining,
  resetAfterSignOut_msg,
  removeGroupPosition,
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
export const selectLoadingStatus_2_msg = createSelector(
  [selectMessageState],
  (userState) => userState.loadingStatus_2
);

export const selectTotalGroupNoteCount = createSelector(
  [selectGroupsPosition, selectGroupNotifications],
  (positions, notes) => {
    const totalCount = positions.reduce((x, y) => {
      const room_id = `${chatType.group}_${y}`;
      if (!notes[room_id]) {
        return (x = x + 0);
      }
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
      return (x = x + notes[room_id].count);
    }, 0);
    return totalCount;
  }
);

// the user/group with the lastest notification will be on top of the list
export function sortByLastAdded(
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

export function pushPositionToTop(
  position: string[],
  target_id: string
): string[] {
  // array.slice takes O(n), array.indexof takes O(n)
  // Cannot use binary-search on position array since the ids are not sorted
  // it should be more efficient than using array.sort() for the newly added notification
  const targetIndex = position.indexOf(target_id);
  const newPosition = [target_id];
  newPosition.push(...position.slice(0, targetIndex));
  newPosition.push(...position.slice(targetIndex + 1));

  return newPosition;
}
