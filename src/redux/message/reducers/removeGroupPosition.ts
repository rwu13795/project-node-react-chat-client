import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { MessageState } from "../messageSlice";

export function removeGroupPosition_reducer(
  state: WritableDraft<MessageState>,
  actiion: PayloadAction<{ group_id: string }>
) {
  state.groupsPosition = state.groupsPosition.filter((id) => {
    return id !== actiion.payload.group_id;
  });
}
