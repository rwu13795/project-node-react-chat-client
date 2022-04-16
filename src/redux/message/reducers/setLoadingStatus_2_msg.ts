import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { MessageState } from "../messageSlice";

export function setLoadingStatus_2_msg_reducer(
  state: WritableDraft<MessageState>,
  action: PayloadAction<string>
) {
  state.loadingStatus_2 = action.payload;
}
