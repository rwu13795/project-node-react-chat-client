import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import {
  chatType,
  MessageObject,
  MessageState,
  pushPositionToTop,
} from "../messageSlice";

export function addNewMessageToHistory_memory_reducer(
  state: WritableDraft<MessageState>,
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
}
