import { createAsyncThunk } from "@reduxjs/toolkit";
import { axios_client } from "../../../utils";

import { serverUrl } from "../../utils";

interface Res_body {
  status: string;
}

export const changeOnlineStatus_session = createAsyncThunk<void, Res_body>(
  "user/changePassword",
  async (body) => {
    const client = axios_client();

    await client.post(serverUrl + `/auth/change-status`, body);
  }
);
