import { ActionCreatorWithPayload, createAsyncThunk } from "@reduxjs/toolkit";

import { client, serverUrl } from "../../utils";
import {
  AddFriendRequest,
  CurrentUser,
  Friend,
  Group,
  GroupInvitation,
} from "../userSlice";

interface Payload {
  currentUser: CurrentUser;
  friendsList: Friend[];
  addFriendRequests: AddFriendRequest[];
  groupsList: Group[];
  groupInvitations: GroupInvitation[];
}

export const getUserAuth = createAsyncThunk<Payload>(
  "user/getUserAuth",
  async () => {
    const response = await client.get<Payload>(
      serverUrl + `/auth/user-auth-status`
    );

    console.log(response.data);

    return response.data;
  }
);
