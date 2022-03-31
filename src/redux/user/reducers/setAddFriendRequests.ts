import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { AddFriendRequest, UserState } from "../userSlice";

export function setAddFriendRequests_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<AddFriendRequest>
) {
  state.addFriendRequests.push(action.payload);
}
