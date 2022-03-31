import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { MessageState } from "../messageSlice";

export function setInfiniteScrollStats_reducer(
  state: WritableDraft<MessageState>,
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
}
