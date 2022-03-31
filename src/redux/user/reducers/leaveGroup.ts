import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function leaveGroup_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<{ group_id: string; was_kicked: boolean }>
) {
  state.groupsList[action.payload.group_id].was_kicked =
    action.payload.was_kicked;
  state.groupsList[action.payload.group_id].user_left = true;
  state.groupsList[action.payload.group_id].user_left_at =
    new Date().toString();
}
