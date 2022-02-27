import { createAsyncThunk } from "@reduxjs/toolkit";

import { client, serverUrl } from "../../utils";
import {
  AddFriendRequest,
  CurrentUser,
  Friend,
  Group,
  GroupInvitation,
} from "../userSlice";

interface GetUserAuth_res {
  currentUser: CurrentUser;
  friendsList: Friend[];
  addFriendRequests: AddFriendRequest[];
  groupsList: Group[];
  groupInvitations: GroupInvitation[];
  require_initialize: boolean;
}

export const getUserAuth = createAsyncThunk<
  GetUserAuth_res,
  { initialize: boolean }
>("user/getUserAuth", async ({ initialize }) => {
  const response = await client.get<GetUserAuth_res>(
    serverUrl + `/auth/user-auth-status?initialize=${initialize ? "yes" : "no"}`
  );

  return response.data;
});
