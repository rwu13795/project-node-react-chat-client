import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { GroupMember, UserState } from "../userSlice";

export function setViewProfileTarget_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<GroupMember>
) {
  state.viewProfileTarget = action.payload;
}
