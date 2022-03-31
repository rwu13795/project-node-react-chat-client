import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function clearAddFriendRequests_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<number>
) {
  state.addFriendRequests = state.addFriendRequests.filter(
    (value, index) => index !== action.payload
  );
}
