import { createAsyncThunk } from "@reduxjs/toolkit";

import { client, serverUrl } from "../../utils";

interface Res_body {
  status: string;
}

export const changeOnlineStatus_session = createAsyncThunk<void, Res_body>(
  "user/changePassword",
  async (body) => {
    await client.post(serverUrl + `/auth/change-status`, body);
  }
);
