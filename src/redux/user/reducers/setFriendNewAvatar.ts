import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function setFriendNewAvatar_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<{ sender_id: string; new_avatar_url: string }>
) {
  const { sender_id, new_avatar_url } = action.payload;
  if (!state.friendsList[sender_id]) return;
  state.friendsList[sender_id].avatar_url = new_avatar_url;
}
