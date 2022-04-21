import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function setFriendNewName_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<{ sender_id: string; new_name: string }>
) {
  const { sender_id, new_name } = action.payload;
  if (!state.friendsList[sender_id]) return;
  state.friendsList[sender_id].friend_username = new_name;
}
