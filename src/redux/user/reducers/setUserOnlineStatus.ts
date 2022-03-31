import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function setUserOnlineStatus_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<string>
) {
  state.currentUser.onlineStatus = action.payload;
}
