import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function updateGroupAdmin_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<{ newAdmin: string; group_id: string }>
) {
  const { newAdmin, group_id } = action.payload;
  state.groupsList[group_id].admin_user_id = newAdmin;
}
