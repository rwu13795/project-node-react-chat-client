import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "../../../utils";

import { serverUrl } from "../../utils";

interface Req_body {
  status: string;
}

export const changeOnlineStatus_session = createAsyncThunk<void, Req_body>(
  "user/changePassword",
  async (body) => {
    const client = AxiosClient.getClient();

    await client.post(serverUrl + `/auth/change-status`, body);
  }
);
