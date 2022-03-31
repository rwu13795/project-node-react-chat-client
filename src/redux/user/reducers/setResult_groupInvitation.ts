import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function setResult_groupInvitation_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<string>
) {
  state.result_groupInvitation = action.payload;
}
