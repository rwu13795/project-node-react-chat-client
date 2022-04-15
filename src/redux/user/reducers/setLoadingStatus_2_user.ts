import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function setLoadingStatus_2_user_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<string>
) {
  state.loadingStatus_2 = action.payload;
}
