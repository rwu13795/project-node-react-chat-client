import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { MessageState } from "../messageSlice";

export function resetVisitedRoom_reducer(
  state: WritableDraft<MessageState>,
  action: PayloadAction<{ room_id: string; visited: boolean }>
): void {
  const { room_id, visited } = action.payload;
  state.visitedRoom[room_id] = visited;
  state.chatHistory[room_id] = [];
  state.infiniteScrollStats[room_id] = {
    hasMore: true,
    pageNum: 2,
  };
}
