import { WritableDraft } from "immer/dist/internal";
import { initialState_msg, MessageState } from "../messageSlice";

export function resetAfterSignOut_msg_reducer(
  state: WritableDraft<MessageState>
) {
  state.targetChatRoom = initialState_msg.targetChatRoom;
  state.chatHistory = initialState_msg.chatHistory;
  state.groupNotifications = initialState_msg.groupNotifications;
  state.friendNotifications = initialState_msg.friendNotifications;
  state.groupsPosition = initialState_msg.groupsPosition;
  state.friendsPosition = initialState_msg.friendsPosition;
  state.visitedRoom = initialState_msg.visitedRoom;
  state.currentUserId_message = initialState_msg.currentUserId_message;
  state.infiniteScrollStats = initialState_msg.infiniteScrollStats;
}
