import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { GroupInvitation, UserState } from "../userSlice";

export function setGroupInvitation_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<GroupInvitation>
) {
  state.groupInvitations.push(action.payload);
}
