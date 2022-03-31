import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { MessageObject, MessageState } from "../messageSlice";

export function loadMoreOldChatHistory_database_reducer(
  state: WritableDraft<MessageState>,
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
}
