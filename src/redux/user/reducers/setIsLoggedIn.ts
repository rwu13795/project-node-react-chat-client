import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function setIsLoggedIn_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<boolean>
) {
  state.currentUser.isLoggedIn = action.payload;
}
