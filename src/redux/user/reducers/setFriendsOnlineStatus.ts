import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function setFriendsOnlineStatus_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<{ sender_id: string; status: string }>
) {
  const { sender_id, status } = action.payload;
  if (!state.friendsList[sender_id]) return;
  state.friendsList[sender_id].onlineStatus = status;
}
