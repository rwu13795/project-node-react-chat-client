import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function setOpenViewProfileModal_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<boolean>
) {
  state.openViewProfileModal = action.payload;
}
