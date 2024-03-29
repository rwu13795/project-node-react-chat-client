import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { UserState } from "../userSlice";

export function deleteGroupInvitation_reducer(
  state: WritableDraft<UserState>,
  action: PayloadAction<{ group_id: string; markAsDiscarded?: boolean }>
) {
  const { group_id, markAsDiscarded } = action.payload;

  if (markAsDiscarded) {
    for (let inv of state.groupInvitations) {
      if (inv.group_id === group_id) {
        inv.discarded = true;
      }
    }
    return;
  }

  state.groupInvitations = state.groupInvitations.filter((group) => {
    return group.group_id !== group_id;
  });
}
