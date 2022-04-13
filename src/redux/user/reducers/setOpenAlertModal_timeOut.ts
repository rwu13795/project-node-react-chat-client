import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function setOpenAlertModal_timeOut_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<boolean>
) {
  state.openAlertModal_timeOut = action.payload;
}
