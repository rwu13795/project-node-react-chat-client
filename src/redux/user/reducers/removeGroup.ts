import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function removeGroup_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<{ group_id: string }>
) {
  delete state.groupsList[action.payload.group_id];
}
