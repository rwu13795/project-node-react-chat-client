import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { MessageState, TargetChatRoom } from "../messageSlice";

export function setTargetChatRoom_reducer(
  state: WritableDraft<MessageState>,
  action: PayloadAction<TargetChatRoom>
): void {
  state.targetChatRoom = action.payload;
  const { type, id } = action.payload;
  // initialize the infiniteScrollStats whenever user enters a room
  if (!state.infiniteScrollStats[`${type}_${id}`]) {
    state.infiniteScrollStats[`${type}_${id}`] = {
      hasMore: true,
      pageNum: 2,
    };
  }
}
