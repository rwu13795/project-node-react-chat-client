import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import {
  axios_client,
  loadingStatusEnum,
  onlineStatus_enum,
} from "../../../utils";

import { serverUrl } from "../../utils";
import {
  AddFriendRequest,
  CurrentUser,
  Friend,
  Group,
  GroupInvitation,
  UserState,
} from "../userSlice";

interface Payload {
  currentUser: CurrentUser;
  friendsList: Friend[];
  addFriendRequests: AddFriendRequest[];
  groupsList: Group[];
  groupInvitations: GroupInvitation[];
  forUpdate?: boolean;
}

export const getUserAuth = createAsyncThunk<Payload, boolean | undefined>(
  "user/getUserAuth",
  async (forUpdate) => {
    const client = axios_client();

    const response = await client.get<Payload>(
      serverUrl + `/auth/user-auth-status`
    );
    return { ...response.data, forUpdate };
  }
);

export function getUserAuth_fulfilled(
  state: WritableDraft<UserState>,
  action: PayloadAction<Payload>
) {
  if (!action.payload.currentUser.isLoggedIn) {
    state.currentUser = action.payload.currentUser;
    return;
  }
  const {
    currentUser,
    addFriendRequests,
    groupInvitations,
    groupsList,
    friendsList,
    forUpdate,
  } = action.payload;

  state.currentUser = currentUser;
  state.addFriendRequests = addFriendRequests;
  state.groupInvitations = groupInvitations;
  // map the groupsList into groupsList. It would be easier to put
  // the group_members in the respective group when user enters a group room
  for (let group of groupsList) {
    state.groupsList[group.group_id] = group;
    if (!group.user_left) {
      state.groupsToJoin.push(group.group_id);
    }
  }

  // initialize the friendsList if it is not initialized
  for (let friend of friendsList) {
    if (!state.friendsList[friend.friend_id]) {
      state.friendsList[friend.friend_id] = friend;
      state.friendsList[friend.friend_id].onlineStatus =
        onlineStatus_enum.offline;
    }
  }

  if (forUpdate) {
    state.loadingStatus_2 = loadingStatusEnum.getAuth_succeeded;
  }
}
