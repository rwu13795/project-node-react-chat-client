import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { MessageState } from "../messageSlice";

export function setCurrentUserId_msg_reducer(
  state: WritableDraft<MessageState>,
  action: PayloadAction<string>
) {
  state.currentUserId_message = action.payload;
}
