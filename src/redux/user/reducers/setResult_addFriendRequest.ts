import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function setResult_addFriendRequest_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<string>
) {
  state.result_addFriendRequest = action.payload;
}
