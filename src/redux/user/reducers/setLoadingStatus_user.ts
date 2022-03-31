import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function setLoadingStatus_user_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<string>
) {
  state.loadingStatus = action.payload;
}
