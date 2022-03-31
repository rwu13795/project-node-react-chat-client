import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function respondToGroupInvitation_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<number>
) {
  state.groupInvitations[action.payload].was_responded = true;
}
